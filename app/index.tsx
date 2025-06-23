// src/App.tsx
import 'global.css'; // Ensure global styles are applied
import React, { useState } from 'react';
import { ScrollView, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DeviceConfig from '../components/DeviceConfig';
import DataCollector from '../components/DataCollector';
import MeshManager from '../components/MeshManager';
import HealthMonitor from '../components/HealthMonitor';
import { DeviceType } from '../lib/types';

// React Native Reusables imports
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { ToastAndroid } from 'react-native';
// Icons
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Settings, 
  Activity,
  Bluetooth,
  RefreshCw
} from 'lucide-react-native';

const App: React.FC = () => {
  const [deviceType, setDeviceType] = useState<DeviceType | null>(null);
  const [deviceId] = useState<string>(Math.random().toString(36).slice(2, 8).toUpperCase());
  const [isOnline, setIsOnline] = useState<boolean>(false);

  const handleConfig = (type: DeviceType) => {
    setDeviceType(type);
    ToastAndroid.show(
      "Device Configured",
      ToastAndroid.SHORT,
    );
  };

  const handleReset = () => {
    setDeviceType(null);
    setIsOnline(false);
    ToastAndroid.show(
      "Device Reset",
      ToastAndroid.SHORT,
    ); 
  };

  const getDeviceIcon = () => {
    if (!deviceType) return <Settings className="h-6 w-6 text-muted-foreground" />;
    return deviceType === 'Human' ? 
      <Activity className="h-6 w-6 text-blue-500" /> : 
      <Smartphone className="h-6 w-6 text-green-500" />;
  };

  const getStatusColor = () => {
    return isOnline ? 'text-green-500' : 'text-red-500';
  };

  const getStatusIcon = () => {
    return isOnline ? 
      <Wifi className="h-4 w-4 text-green-500" /> : 
      <WifiOff className="h-4 w-4 text-red-500" />;
  };

  const getDeviceTypeColor = () => {
    if (!deviceType) return 'text-muted-foreground';
    return deviceType === 'Human' ? 'text-blue-500' : 'text-green-500';
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header Section */}
      <View className="px-6 pt-4 pb-2">
        <Card>
          <CardHeader className="pb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Bluetooth className="h-8 w-8 text-primary" />
                <View>
                  <CardTitle className="text-2xl">BLE Mesh Demo</CardTitle>
                  <Text className="text-sm text-muted-foreground">
                    Bluetooth Low Energy Mesh Network
                  </Text>
                </View>
              </View>
              
              {deviceType && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onPress={handleReset}
                  className="flex-row items-center"
                >
                  <Text>Reset</Text>
                </Button>
              )}
            </View>
          </CardHeader>
          
          <CardContent>
            {/* Device Info Row */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2">
                {getDeviceIcon()}
                <View>
                  <Text className="font-medium">Device ID</Text>
                  <Text className="text-sm text-muted-foreground font-mono">
                    {deviceId}
                  </Text>
                </View>
              </View>
              
              <View className="items-end">
                <Text className="text-sm text-muted-foreground mb-1">Type</Text>
                <Badge 
                  variant={deviceType ? "default" : "secondary"}
                  className={deviceType ? "" : "bg-gray-100"}
                >
                  <Text className={getDeviceTypeColor()}>
                  {deviceType || 'Not Configured'}
                  </Text>
                </Badge>
              </View>
            </View>

            <Separator className="my-4" />

            {/* Status Row */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                {getStatusIcon()}
                <Text className="font-medium">Connection Status</Text>
              </View>
              
              <View className="flex-row items-center gap-2">
                <View className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                <Text className={`font-medium ${getStatusColor()}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Main Content */}
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {!deviceType ? (
          /* Configuration Screen */
          <View className="px-6">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-center text-xl">
                  Welcome to BLE Mesh Demo
                </CardTitle>
                
              </CardHeader>
              <CardContent>
                <DeviceConfig onConfig={handleConfig} />
              </CardContent>
            </Card>

            {/* Info Cards */}
            <View className="mt-6 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <View className="flex-row items-center gap-3 mb-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <Text className="font-medium">Human Device</Text>
                  </View>
                  <Text className="text-sm text-muted-foreground">
                    Monitor health metrics like heart rate and fatigue levels
                  </Text>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <View className="flex-row items-center gap-3 mb-2">
                    <Smartphone className="h-5 w-5 text-green-500" />
                    <Text className="font-medium">Machine Device</Text>
                  </View>
                  <Text className="text-sm text-muted-foreground">
                    Track machine performance, speed, and engine status
                  </Text>
                </CardContent>
              </Card>
            </View>
          </View>
        ) : (
          /* Main Application Interface */
          <View className="px-6">
            {/* Quick Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Device Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <View className="flex-row justify-between">
                  <View className="items-center">
                    <Text className={`text-2xl font-bold ${getDeviceTypeColor()}`}>
                      {deviceType}
                    </Text>
                    <Text className="text-sm text-muted-foreground">Device Type</Text>
                  </View>
                  <View className="items-center">
                    <Text className={`text-2xl font-bold ${getStatusColor()}`}>
                      {isOnline ? '100%' : '0%'}
                    </Text>
                    <Text className="text-sm text-muted-foreground">Connectivity</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-primary">
                      {deviceId}
                    </Text>
                    <Text className="text-sm text-muted-foreground">Node ID</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* Component Sections */}
            <View className="mt-6">
              {/* Data Collection Section */}
              <View className="mb-6">
                <View className="flex-row items-center gap-2 mb-3">
                  <Activity className="h-5 w-5 text-primary" />
                  <Text className="text-lg font-semibold">Data Collection</Text>
                </View>
                <DataCollector 
                  deviceType={deviceType} 
                  deviceId={deviceId} 
                  isOnline={isOnline} 
                />
              </View>

              {/* Mesh Network Section */}
              <View className="mb-6">
                <View className="flex-row items-center gap-2 mb-3">
                  <Bluetooth className="h-5 w-5 text-primary" />
                  <Text className="text-lg font-semibold">Mesh Network</Text>
                </View>
                <MeshManager 
                  deviceId={deviceId} 
                  setIsOnline={setIsOnline} 
                  isOnline={isOnline} 
                />
              </View>

              {/* Health Monitoring Section */}
              <View className="mb-6">
                <View className="flex-row items-center gap-2 mb-3">
                  <Wifi className="h-5 w-5 text-primary" />
                  <Text className="text-lg font-semibold">Health Monitor</Text>
                </View>
                <HealthMonitor 
                  deviceId={deviceId} 
                  isOnline={isOnline} 
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;