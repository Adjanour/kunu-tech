// lib/useCorrectedMeshNetwork.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import BleAdvertise from 'react-native-ble-advertise';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Platform, PermissionsAndroid } from 'react-native';
import base64 from 'react-native-base64';
import { TelemetryData, HealthData, DeviceType } from './types';

// BLE Configuration
const SERVICE_UUID = '0000FF00-0000-1000-8000-00805F9B34FB';
const DATA_CHARACTERISTIC_UUID = '0000FF01-0000-1000-8000-00805F9B34FB';
const MESH_IDENTIFIER = 'MineMesh';
const COMPANY_ID = 0x00E0;

// Utility functions for encoding/decoding device info in iBeacon format
const encodeDeviceInfo = (deviceId: string, deviceType: DeviceType): { major: number; minor: number } => {
  const deviceTypeCode = deviceType === 'Human' ? 0x01 : 0x02;
  const deviceIdHash = deviceId.split('').reduce((hash, char) => {
    return ((hash << 5) - hash + char.charCodeAt(0)) & 0xFFFF;
  }, 0);
  
  const major = (deviceTypeCode << 12) | (deviceIdHash & 0x0FFF);
  const minor = (Date.now() & 0xFFFF);
  
  return { major, minor };
};

const decodeDeviceInfo = (major?: number): { deviceType?: DeviceType } => {
  if (major === undefined) return {};
  
  const deviceTypeCode = (major >> 12) & 0x0F;
  const deviceType = deviceTypeCode === 0x01 ? 'Human' : 'Vehicle';
  
  return { deviceType };
};

export interface MeshNode {
  id: string;
  device: Device;
  name: string;
  rssi: number;
  lastSeen: number;
  isConnected: boolean;
  deviceType?: DeviceType;
}

export interface MeshStats {
  totalNodesDiscovered: number;
  connectedNodes: number;
  messagesReceived: number;
  messagesSent: number;
  dataForwarded: number;
  isOnline: boolean;
  isAdvertising: boolean;
  isScanning: boolean;
}

interface UseCorrectedMeshNetworkProps {
  deviceId: string;
  deviceType: DeviceType;
  onDataReceived?: (data: TelemetryData | HealthData, fromNode?: string) => void;
  onNodeConnected?: (node: MeshNode) => void;
  onNodeDisconnected?: (nodeId: string) => void;
  serverEndpoint?: string;
}

export const useCorrectedMeshNetwork = ({
  deviceId,
  deviceType,
  onDataReceived,
  onNodeConnected,
  onNodeDisconnected,
  serverEndpoint = 'http://192.168.43.199:3000'
}: UseCorrectedMeshNetworkProps) => {
  // Core state
  const [isOnline, setIsOnline] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isAdvertising, setIsAdvertising] = useState(false);
  const [meshNodes, setMeshNodes] = useState<Map<string, MeshNode>>(new Map());
  const [stats, setStats] = useState<MeshStats>({
    totalNodesDiscovered: 0,
    connectedNodes: 0,
    messagesReceived: 0,
    messagesSent: 0,
    dataForwarded: 0,
    isOnline: false,
    isAdvertising: false,
    isScanning: false,
  });

  // Refs for cleanup and state management
  const bleManager = useRef(new BleManager()).current;
  const processedMessages = useRef(new Set<string>()).current;
  const scanTimeout = useRef<NodeJS.Timeout | null>(null);
  const connectingDevices = useRef(new Set<string>()).current;

  // Request all necessary permissions
  const requestPermissions = useCallback(async () => {
    if (Platform.OS !== 'android') return true;

    const permissions = [
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ];

    if (Number(Platform.Version) >= 31) {
      permissions.push(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE
      );
    }

    const results = await PermissionsAndroid.requestMultiple(permissions);
    return permissions.every(permission => 
      results[permission] === PermissionsAndroid.RESULTS.GRANTED
    );
  }, []);

  // Check internet connectivity
  const checkConnectivity = useCallback(async (): Promise<boolean> => {
    try {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected || !netInfo.isInternetReachable) return false;
      
      const response = await fetch(`${serverEndpoint}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }, [serverEndpoint]);

  // Update online status
  const updateOnlineStatus = useCallback(async () => {
    const online = await checkConnectivity();
    setIsOnline(online);
    setStats(prev => ({ ...prev, isOnline: online }));
  }, [checkConnectivity]);

  // Generate unique message ID for deduplication
  const generateMessageId = useCallback((data: any): string => {
    const source = data.deviceId || data.origin || 'unknown';
    const content = JSON.stringify(data).slice(0, 100);
    return `${source}_${data.timestamp}_${content}`;
  }, []);

  // START ADVERTISING (using react-native-ble-advertise)
  const startMeshAdvertising = useCallback(async () => {
    if (isAdvertising) return true;

    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        console.warn('BLE permissions not granted');
        return false;
      }

      // Check if advertising is supported
      const isSupported = await BleAdvertise.checkIfBLESupported();
      if (!isSupported) {
        console.warn('BLE advertising not supported on this device');
        return false;
      }

      // Set company ID for manufacturer data
      BleAdvertise.setCompanyId(COMPANY_ID);

      // Encode device info into major/minor values using utility function
      const { major, minor } = encodeDeviceInfo(deviceId, deviceType);

      // Start advertising with UUID, major, minor (iBeacon format)
      // Note: Device name cannot be set with react-native-ble-advertise
      // The device will appear with its system Bluetooth name
      await BleAdvertise.broadcast(SERVICE_UUID, major, minor);

      setIsAdvertising(true);
      setStats(prev => ({ ...prev, isAdvertising: true }));
      
      console.log(`✅ Started advertising with UUID: ${SERVICE_UUID}, Major: ${major.toString(16)}, Minor: ${minor.toString(16)}`);
      console.log(`📝 Note: Device will appear with system Bluetooth name, not MineMesh-${deviceId}`);
      return true;

    } catch (error) {
      console.error('❌ Failed to start advertising:', error);
      setIsAdvertising(false);
      return false;
    }
  }, [isAdvertising, deviceId, deviceType, requestPermissions]);

  // STOP ADVERTISING
  const stopMeshAdvertising = useCallback(async () => {
    if (!isAdvertising) return;

    try {
      await BleAdvertise.stopBroadcast();
      setIsAdvertising(false);
      setStats(prev => ({ ...prev, isAdvertising: false }));
      console.log('✅ Stopped advertising');
    } catch (error) {
      console.error('❌ Failed to stop advertising:', error);
    }
  }, [isAdvertising]);

  // START SCANNING (using react-native-ble-plx)
  const startMeshScanning = useCallback(async () => {
    if (isScanning) return;

    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        console.warn('BLE permissions not granted');
        return;
      }

      await bleManager.enable();
      setIsScanning(true);
      setStats(prev => ({ ...prev, isScanning: true }));

      console.log('🔍 Starting mesh scan...');
      
      bleManager.startDeviceScan([SERVICE_UUID], null, (error, device) => {
        if (error) {
          console.error('❌ Scan error:', error);
          setIsScanning(false);
          setStats(prev => ({ ...prev, isScanning: false }));
          return;
        }

        // Since react-native-ble-advertise can't set custom names,
        // we identify mesh devices by their service UUID and major/minor data
        if (device && device.serviceUUIDs?.includes(SERVICE_UUID)) {
          
          // Parse major/minor data if available from iBeacon format
          let deviceTypeFromData: DeviceType | undefined;
          let originalDeviceId: string | undefined;
          
          try {
            // Extract device info from major/minor values using utility function
            if (device.manufacturerData) {
              const major = device.manufacturerData?.major;
              if (major !== undefined) {
                const decoded = decodeDeviceInfo(major);
                deviceTypeFromData = decoded.deviceType;
              }
            }
            
            // For react-native-ble-advertise, we can't set custom names
            // So we'll use the device.id as the node identifier
            originalDeviceId = device.id.slice(-6); // Use last 6 chars of device ID
            
            // Don't process our own device (this is tricky without custom names)
            // We'll try to filter by checking if this device has the same major value as ours
            const ourMajor = encodeDeviceInfo(deviceId, deviceType).major;
            if (device.manufacturerData?.major === ourMajor) {
              console.log('🔄 Skipping our own device based on major value match');
              return;
            }
            
          } catch {
            // Ignore parsing errors - we'll fall back to device ID based identification
            originalDeviceId = device.id.slice(-6);
          }

          setMeshNodes(prev => {
            const updated = new Map(prev);
            const existing = updated.get(device.id);
            
            const nodeData: MeshNode = {
              id: originalDeviceId || device.id.slice(-6),
              device,
              name: device.name || `Mesh-${originalDeviceId || device.id.slice(-6)}`,
              rssi: device.rssi || -100,
              lastSeen: Date.now(),
              isConnected: existing?.isConnected || false,
              deviceType: deviceTypeFromData,
            };
            
            updated.set(device.id, nodeData);
            
            // Update stats if new node
            if (!existing) {
              setStats(prev => ({ 
                ...prev, 
                totalNodesDiscovered: prev.totalNodesDiscovered + 1 
              }));
              console.log(`📱 Discovered new mesh node: ${nodeData.name} (${deviceTypeFromData || 'Unknown'}) ID: ${originalDeviceId || device.id.slice(-6)}`);
            }
            
            return updated;
          });

          // Attempt connection if not already connected/connecting
          if (!connectingDevices.has(device.id)) {
            const existingNode = meshNodes.get(device.id);
            if (!existingNode?.isConnected) {
              connectToMeshNode(device);
            }
          }
        }
      });

      // Stop scanning after 30 seconds, then restart
      if (scanTimeout.current) {
        clearTimeout(scanTimeout.current);
      }
      
      scanTimeout.current = setTimeout(() => {
        bleManager.stopDeviceScan();
        setIsScanning(false);
        setStats(prev => ({ ...prev, isScanning: false }));
        
        // Restart scanning after a brief pause
        setTimeout(() => {
          if (!isScanning) {
            startMeshScanning();
          }
        }, 5000);
      }, 30000);

    } catch (error) {
      console.error('❌ Failed to start scanning:', error);
      setIsScanning(false);
      setStats(prev => ({ ...prev, isScanning: false }));
    }
  }, [isScanning, bleManager, deviceId, requestPermissions, meshNodes]);

  // CONNECT TO MESH NODE
  const connectToMeshNode = useCallback(async (device: Device) => {
    if (connectingDevices.has(device.id)) return;
    
    connectingDevices.add(device.id);
    
    try {
      console.log(`🔗 Connecting to mesh node: ${device.name}...`);
      
      const connectedDevice = await device.connect();
      await connectedDevice.discoverAllServicesAndCharacteristics();

      // Update node connection status
      setMeshNodes(prev => {
        const updated = new Map(prev);
        const node = updated.get(device.id);
        if (node) {
          const updatedNode = { ...node, isConnected: true };
          updated.set(device.id, updatedNode);
          setStats(prev => ({ 
            ...prev, 
            connectedNodes: Array.from(updated.values()).filter(n => n.isConnected).length 
          }));
          
          console.log(`✅ Connected to: ${device.name}`);
          onNodeConnected?.(updatedNode);
        }
        return updated;
      });

      // Setup data monitoring
      await setupDataMonitoring(connectedDevice);

    } catch (error) {
      console.error(`❌ Failed to connect to ${device.name}:`, error);
      
      // Update connection status on failure
      setMeshNodes(prev => {
        const updated = new Map(prev);
        const node = updated.get(device.id);
        if (node) {
          updated.set(device.id, { ...node, isConnected: false });
        }
        return updated;
      });
    } finally {
      connectingDevices.delete(device.id);
    }
  }, [connectingDevices, onNodeConnected]);

  // SETUP DATA MONITORING
  const setupDataMonitoring = useCallback(async (device: Device) => {
    try {
      // Handle disconnection
      device.onDisconnected((error, disconnectedDevice) => {
        console.log(`🔌 Device disconnected: ${disconnectedDevice?.name}`);
        
        setMeshNodes(prev => {
          const updated = new Map(prev);
          const node = updated.get(disconnectedDevice!.id);
          if (node) {
            updated.set(disconnectedDevice!.id, { ...node, isConnected: false });
            setStats(prev => ({ 
              ...prev, 
              connectedNodes: Array.from(updated.values()).filter(n => n.isConnected).length 
            }));
            
            onNodeDisconnected?.(node.id);
          }
          return updated;
        });
      });

      // Monitor for incoming data
      await device.monitorCharacteristicForService(
        SERVICE_UUID,
        DATA_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.error('❌ Monitoring error:', error);
            return;
          }

          if (characteristic?.value) {
            try {
              const decoded = base64.decode(characteristic.value);
              const data: TelemetryData | HealthData = JSON.parse(decoded);
              
              const nodeData = meshNodes.get(device.id);
              handleReceivedMeshData(data, nodeData?.id);
              
              setStats(prev => ({ 
                ...prev, 
                messagesReceived: prev.messagesReceived + 1 
              }));
              
            } catch (parseError) {
              console.error('❌ Failed to parse received data:', parseError);
            }
          }
        }
      );
    } catch (error) {
      console.error('❌ Failed to setup monitoring:', error);
    }
  }, [meshNodes, onNodeDisconnected]);

  // HANDLE RECEIVED MESH DATA
  const handleReceivedMeshData = useCallback(async (
    data: TelemetryData | HealthData, 
    fromNodeId?: string
  ) => {
    const messageId = generateMessageId(data);
    
    // Prevent processing duplicate messages
    if (processedMessages.has(messageId)) {
      return;
    }
    processedMessages.add(messageId);

    // Clean up old message IDs periodically
    if (processedMessages.size > 1000) {
      const entries = Array.from(processedMessages);
      entries.slice(0, 500).forEach(id => processedMessages.delete(id));
    }

    console.log(`📨 Received mesh data from ${fromNodeId}:`, data);

    // Update pathway for telemetry data
    let forwardData = data;
    if ('origin' in data && data.origin !== deviceId) {
      // Avoid loops - don't forward if we're already in the pathway
      if (data.pathway?.includes(deviceId)) {
        console.log('🔄 Avoiding forwarding loop');
        return;
      }
      
      forwardData = {
        ...data,
        pathway: [...(data.pathway || []), deviceId],
      };
    }

    // Notify parent component
    onDataReceived?.(forwardData, fromNodeId);

    // Forward to other connected nodes (excluding sender)
    await forwardDataToMesh(forwardData, fromNodeId);

    // Sync to server or cache locally
    if (isOnline) {
      await syncDataToServer(forwardData);
    } else {
      await cacheDataLocally(forwardData);
    }
  }, [deviceId, isOnline, generateMessageId, processedMessages, onDataReceived]);

  // FORWARD DATA TO MESH
  const forwardDataToMesh = useCallback(async (
    data: TelemetryData | HealthData,
    excludeNodeId?: string
  ) => {
    const connectedNodes = Array.from(meshNodes.values()).filter(
      node => node.isConnected && node.id !== excludeNodeId
    );

    if (connectedNodes.length === 0) return;

    console.log(`📤 Forwarding data to ${connectedNodes.length} nodes`);
    
    const encodedData = base64.encode(JSON.stringify(data));
    let forwardCount = 0;

    for (const node of connectedNodes) {
      try {
        await node.device.writeCharacteristicWithResponseForService(
          SERVICE_UUID,
          DATA_CHARACTERISTIC_UUID,
          encodedData
        );
        
        forwardCount++;
        console.log(`✅ Forwarded data to: ${node.name}`);
        
      } catch (error) {
        console.error(`❌ Failed to forward to ${node.name}:`, error);
        
        // Mark node as disconnected on error
        setMeshNodes(prev => {
          const updated = new Map(prev);
          const nodeData = updated.get(node.device.id);
          if (nodeData) {
            updated.set(node.device.id, { ...nodeData, isConnected: false });
          }
          return updated;
        });
      }
    }

    if (forwardCount > 0) {
      setStats(prev => ({ 
        ...prev, 
        dataForwarded: prev.dataForwarded + forwardCount 
      }));
    }
  }, [meshNodes]);

  // BROADCAST DATA TO MESH
  const broadcastData = useCallback(async (data: TelemetryData | HealthData) => {
    const messageId = generateMessageId(data);
    processedMessages.add(messageId);
    
    console.log('📡 Broadcasting data to mesh:', data);
    
    await forwardDataToMesh(data);
    
    setStats(prev => ({ 
      ...prev, 
      messagesSent: prev.messagesSent + 1 
    }));
    
    // Sync to server or cache
    if (isOnline) {
      await syncDataToServer(data);
    } else {
      await cacheDataLocally(data);
    }
  }, [generateMessageId, processedMessages, forwardDataToMesh, isOnline]);

  // SYNC TO SERVER
  const syncDataToServer = useCallback(async (data: TelemetryData | HealthData) => {
    try {
      const endpoint = 'rssi' in data ? '/health' : '/data';
      
      const response = await fetch(`${serverEndpoint}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      console.log('☁️ Data synced to server successfully');
    } catch (error) {
      console.error('❌ Failed to sync to server:', error);
      await cacheDataLocally(data);
    }
  }, [serverEndpoint]);

  // CACHE DATA LOCALLY
  const cacheDataLocally = useCallback(async (data: TelemetryData | HealthData) => {
    try {
      const cached = JSON.parse(
        (await AsyncStorage.getItem('cachedMeshData')) || '[]'
      ) as (TelemetryData | HealthData)[];
      
      cached.push({
        ...data,
        cachedAt: Date.now(),
      });
      
      // Keep only latest 500 entries
      if (cached.length > 500) {
        cached.splice(0, cached.length - 500);
      }
      
      await AsyncStorage.setItem('cachedMeshData', JSON.stringify(cached));
      console.log('💾 Data cached locally');
    } catch (error) {
      console.error('❌ Failed to cache data:', error);
    }
  }, []);

  // SYNC CACHED DATA
  const syncCachedData = useCallback(async () => {
    if (!isOnline) return;
    
    try {
      const cached = JSON.parse(
        (await AsyncStorage.getItem('cachedMeshData')) || '[]'
      ) as (TelemetryData | HealthData)[];
      
      if (cached.length === 0) return;
      
      console.log(`☁️ Syncing ${cached.length} cached items...`);
      
      for (const data of cached) {
        await syncDataToServer(data);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      await AsyncStorage.setItem('cachedMeshData', '[]');
      console.log('✅ All cached data synced successfully');
      
    } catch (error) {
      console.error('❌ Failed to sync cached data:', error);
    }
  }, [isOnline, syncDataToServer]);

  // CLEANUP STALE NODES
  const cleanupStaleNodes = useCallback(() => {
    const now = Date.now();
    const staleThreshold = 120000; // 2 minutes
    
    setMeshNodes(prev => {
      const updated = new Map(prev);
      let removedCount = 0;
      
      for (const [deviceIdKey, node] of updated) {
        if (now - node.lastSeen > staleThreshold) {
          if (node.isConnected) {
            node.device.cancelConnection().catch(console.error);
            onNodeDisconnected?.(node.id);
          }
          updated.delete(deviceIdKey);
          removedCount++;
        }
      }
      
      if (removedCount > 0) {
        console.log(`🧹 Cleaned up ${removedCount} stale nodes`);
        setStats(prev => ({ 
          ...prev, 
          connectedNodes: Array.from(updated.values()).filter(n => n.isConnected).length 
        }));
      }
      
      return updated;
    });
  }, [onNodeDisconnected]);

  // INITIALIZE MESH
  const initializeMesh = useCallback(async () => {
    try {
      console.log('🚀 Initializing corrected mesh network...');
      
      await bleManager.enable();
      await updateOnlineStatus();
      
      // Start advertising (using react-native-ble-advertise)
      await startMeshAdvertising();
      
      // Start scanning (using react-native-ble-plx)
      await startMeshScanning();
      
      console.log('✅ Mesh network initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize mesh network:', error);
    }
  }, [bleManager, updateOnlineStatus, startMeshAdvertising, startMeshScanning]);

  // SHUTDOWN MESH
  const shutdownMesh = useCallback(async () => {
    console.log('🔌 Shutting down mesh network...');
    
    // Stop scanning
    if (scanTimeout.current) {
      clearTimeout(scanTimeout.current);
    }
    bleManager.stopDeviceScan();
    setIsScanning(false);
    
    // Stop advertising
    await stopMeshAdvertising();
    
    // Disconnect all nodes
    const connectedNodes = Array.from(meshNodes.values()).filter(n => n.isConnected);
    for (const node of connectedNodes) {
      try {
        await node.device.cancelConnection();
      } catch (error) {
        console.error(`❌ Failed to disconnect from ${node.name}:`, error);
      }
    }
    
    setMeshNodes(new Map());
    console.log('✅ Mesh network shutdown complete');
  }, [bleManager, stopMeshAdvertising, meshNodes, scanTimeout]);

  // GET MESH STATS
  const getMeshStats = useCallback((): MeshStats => {
    const connectedCount = Array.from(meshNodes.values()).filter(n => n.isConnected).length;
    
    return {
      ...stats,
      connectedNodes: connectedCount,
      isAdvertising,
      isScanning,
    };
  }, [stats, meshNodes, isAdvertising, isScanning]);

  // EFFECTS
  useEffect(() => {
    initializeMesh();
    
    const statusInterval = setInterval(updateOnlineStatus, 15000);
    const cleanupInterval = setInterval(cleanupStaleNodes, 60000);
    
    const unsubscribeNetInfo = NetInfo.addEventListener(async (state) => {
      await updateOnlineStatus();
      if (state.isConnected && state.isInternetReachable && isOnline) {
        await syncCachedData();
      }
    });

    return () => {
      clearInterval(statusInterval);
      clearInterval(cleanupInterval);
      unsubscribeNetInfo();
      shutdownMesh();
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      syncCachedData();
    }
  }, [isOnline, syncCachedData]);

  return {
    // State
    isOnline,
    isScanning,
    isAdvertising,
    meshNodes: Array.from(meshNodes.values()),
    stats: getMeshStats(),
    
    // Actions
    broadcastData,
    startMeshScanning,
    stopMeshScanning: () => {
      if (scanTimeout.current) clearTimeout(scanTimeout.current);
      bleManager.stopDeviceScan();
      setIsScanning(false);
    },
    startMeshAdvertising,
    stopMeshAdvertising,
    syncCachedData,
    cleanupStaleNodes,
    
    // Utils
    getConnectedNodes: () => Array.from(meshNodes.values()).filter(n => n.isConnected),
    getNodeById: (id: string) => Array.from(meshNodes.values()).find(n => n.id === id),
    getMeshStats,
  };
};