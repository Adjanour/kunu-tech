import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceType, TelemetryData } from '../lib/types';

// React Native Reusables imports
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/utils';

// Icons (assuming you have Lucide React Native or similar)
import { Heart, Gauge, Cpu, Wifi, WifiOff, RefreshCw } from 'lucide-react-native';

interface Props {
  deviceType: DeviceType;
  deviceId: string;
  isOnline: boolean;
}

const DataCollector: React.FC<Props> = ({ deviceType, deviceId, isOnline }) => {
  const [data, setData] = useState<TelemetryData[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [inputData, setInputData] = useState<{
    heartRate: string;
    speed: string;
    engineStatus: string;
  }>({ heartRate: '', speed: '', engineStatus: '' });

  // Simulate sensor data or use manual input
  const generateData = (): TelemetryData => {
    if (deviceType === 'Human') {
      const heartRate = inputData.heartRate
        ? parseInt(inputData.heartRate, 10)
        : Math.floor(Math.random() * 40 + 80); // 80-120 bpm
      const status = heartRate > 100 ? 'Fatigue Alert' : 'Normal';
      return {
        deviceId,
        timestamp: Date.now(),
        origin: deviceId,
        pathway: [deviceId],
        heartRate,
        status,
      };
    }
    const speed = inputData.speed
      ? parseFloat(inputData.speed)
      : Math.floor(Math.random() * 30); // 0-30 km/h
    const engineStatus = inputData.engineStatus || (Math.random() > 0.8 ? 'Fault' : 'OK');
    return {
      deviceId,
      timestamp: Date.now(),
      origin: deviceId,
      pathway: [deviceId],
      speed,
      engineStatus,
    };
  };

  // Cache data locally
  const cacheData = async (newData: TelemetryData) => {
    const cached = JSON.parse(
      (await AsyncStorage.getItem('cachedData')) || '[]',
    ) as TelemetryData[];
    const updated = [...cached, newData];
    await AsyncStorage.setItem('cachedData', JSON.stringify(updated));
    setData(updated);
  };

  // Sync with server
  const syncData = async (data: TelemetryData) => {
    try {
      await fetch('http://192.168.43.199:3000/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      // Clear cache for this device
      const cached = JSON.parse(
        (await AsyncStorage.getItem('cachedData')) || '[]',
      ) as TelemetryData[];
      const filtered = cached.filter((d) => d.origin !== deviceId);
      await AsyncStorage.setItem('cachedData', JSON.stringify(filtered));
      setData(filtered);
    } catch (error) {
      console.log('Sync failed:', error);
      await cacheData(data);
      Alert.alert('Sync Failed', 'Data cached locally for later sync');
    }
  };

  // Generate and handle data
  const collectData = async () => {
    setIsCollecting(true);
    try {
      const newData = generateData();
      if (isOnline) {
        await syncData(newData);
      } else {
        await cacheData(newData);
      }
    } finally {
      setIsCollecting(false);
    }
  };

  // Periodic data collection
  useEffect(() => {
    const interval = setInterval(collectData, 5000); // Every 5s
    return () => clearInterval(interval);
  }, [isOnline, inputData]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Fatigue Alert':
      case 'Fault':
        return 'destructive';
      case 'Normal':
      case 'OK':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getDeviceIcon = () => {
    return deviceType === 'Human' ? 
      <Heart className="h-5 w-5 text-red-500" /> : 
      <Cpu className="h-5 w-5 text-blue-500" />;
  };

  return (
    <ScrollView className="flex-1 p-4 bg-background">
      {/* Header Card */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              {getDeviceIcon()}
              <CardTitle className="text-xl">
                {deviceType} Telemetry
              </CardTitle>
            </View>
            <View className="flex-row items-center gap-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <Badge variant={isOnline ? 'default' : 'destructive'}>
                <Text className="text-xs">
                {isOnline ? 'Online' : 'Offline'}
                </Text>
              </Badge>
            </View>
          </View>
          <Text className="text-sm text-muted-foreground">
            Device ID: {deviceId}
          </Text>
        </CardHeader>
      </Card>

      {/* Data Input Card */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Manual Data Input</CardTitle>
          <Text className="text-sm text-muted-foreground">
            Override automatic sensors with manual values
          </Text>
        </CardHeader>
        <CardContent className="gap-4">
          {deviceType === 'Human' ? (
            <View className="gap-2">
              <Text className="text-sm font-medium">Heart Rate (BPM)</Text>
              <Input
                placeholder="Enter heart rate..."
                keyboardType="numeric"
                value={inputData.heartRate}
                onChangeText={(text) => 
                  setInputData({ ...inputData, heartRate: text })
                }
                className="h-12"
              />
            </View>
          ) : (
            <>
              <View className="gap-2">
                <Text className="text-sm font-medium">Speed (km/h)</Text>
                <Input
                  placeholder="Enter speed..."
                  keyboardType="numeric"
                  value={inputData.speed}
                  onChangeText={(text) => 
                    setInputData({ ...inputData, speed: text })
                  }
                  className="h-12"
                />
              </View>
              <View className="gap-2">
                <Text className="text-sm font-medium">Engine Status</Text>
                <Input
                  placeholder="OK or Fault"
                  value={inputData.engineStatus}
                  onChangeText={(text) => 
                    setInputData({ ...inputData, engineStatus: text })
                  }
                  className="h-12"
                />
              </View>
            </>
          )}
          
          <Button 
            onPress={collectData}
            disabled={isCollecting}
            className="mt-4 h-12"
          >
            <View className="flex-row items-center gap-2">
              <RefreshCw 
                className={cn(
                  "h-4 w-4 text-white",
                  isCollecting && "animate-spin"
                )} 
              />
              <Text className="text-white font-medium">
                {isCollecting ? 'Collecting...' : 'Collect Data Now'}
              </Text>
            </View>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Data Card */}
      {data.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Recent Data</CardTitle>
            <Text className="text-sm text-muted-foreground">
              {data.length} cached entries
            </Text>
          </CardHeader>
          <CardContent>
            {data.slice(-3).reverse().map((item, index) => (
              <View key={`${item.timestamp}-${index}`}>
                <View className="flex-row items-center justify-between py-3">
                  <View className="flex-1">
                    <Text className="font-medium">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </Text>
                    <View className="flex-row items-center gap-2 mt-1">
                      {deviceType === 'Human' ? (
                        <>
                          <Gauge className="h-4 w-4 text-muted-foreground" />
                          <Text className="text-sm text-muted-foreground">
                            {item.heartRate} BPM
                          </Text>
                        </>
                      ) : (
                        <>
                          <Gauge className="h-4 w-4 text-muted-foreground" />
                          <Text className="text-sm text-muted-foreground">
                            {item.speed} km/h
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                  <Badge 
                    variant={getStatusBadgeVariant(
                      deviceType === 'Human' ? item.status : item.engineStatus
                    )}
                  >
                    <Text className="text-xs">
                      {deviceType === 'Human' ? 'Status' : 'Engine Status'}
                    </Text>
                  </Badge>
                </View>
                {index < 2 && <Separator />}
              </View>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold">{data.length}</Text>
              <Text className="text-sm text-muted-foreground">Total Records</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold">
                {data.filter(d => 
                  deviceType === 'Human' 
                    ? d.status === 'Normal' 
                    : d.engineStatus === 'OK'
                ).length}
              </Text>
              <Text className="text-sm text-muted-foreground">Normal Status</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-red-500">
                {data.filter(d => 
                  deviceType === 'Human' 
                    ? d.status === 'Fatigue Alert' 
                    : d.engineStatus === 'Fault'
                ).length}
              </Text>
              <Text className="text-sm text-muted-foreground">Alerts</Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  );
};

export default DataCollector;