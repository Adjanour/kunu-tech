import React, { useEffect, useState } from 'react';
import { View, Animated } from 'react-native';
import { HealthData } from '../lib/types';

// React Native Reusables imports
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';
import { cn } from '~/lib/utils';

// Icons
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  Timer, 
  Signal, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react-native';

interface Props {
  deviceId: string;
  isOnline: boolean;
}

const HealthMonitor: React.FC<Props> = ({ deviceId, isOnline }) => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'critical'>('good');
  const [uptime, setUptime] = useState<number>(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Animate pulse for active status
  useEffect(() => {
    if (isOnline) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isOnline, pulseAnim]);

  // Track uptime
  useEffect(() => {
    const uptimeInterval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(uptimeInterval);
  }, []);

  // Determine connection quality based on RSSI and latency
  const getConnectionQuality = (rssi: number, latency: number): typeof connectionQuality => {
    if (rssi > -50 && latency < 150) return 'excellent';
    if (rssi > -65 && latency < 250) return 'good';
    if (rssi > -75 && latency < 400) return 'poor';
    return 'critical';
  };

  // Get signal strength percentage from RSSI
  const getSignalStrength = (rssi: number): number => {
    // Convert RSSI (-100 to -30 dBm) to percentage (0-100%)
    return Math.max(0, Math.min(100, (rssi + 100) * (100 / 70)));
  };

  const checkHealth = async () => {
    const currentTime = Date.now();
    const inactivityThreshold = 30000; // 30s
    
    if (currentTime - lastActivity > inactivityThreshold) {
      const newHealthData: HealthData = {
        deviceId,
        timestamp: currentTime,
        rssi: Math.floor(Math.random() * -20 - 60), // -60 to -80 dBm
        latency: Math.floor(Math.random() * 400 + 100), // 100-500ms
      };
      
      setHealthData(newHealthData);
      setConnectionQuality(getConnectionQuality(newHealthData.rssi, newHealthData.latency));
      
      try {
        await fetch('http://192.168.43.199:3000/health', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newHealthData),
        });
        setLastActivity(currentTime);
      } catch (error) {
        console.log('Health check failed:', error);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(checkHealth, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [deviceId, lastActivity]);

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-500';
    switch (connectionQuality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'poor': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    if (!isOnline) {
      return <WifiOff className="h-5 w-5 text-red-500" />;
    }
    
    switch (connectionQuality) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'poor':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBadgeVariant = () => {
    if (!isOnline) return 'destructive';
    switch (connectionQuality) {
      case 'excellent':
      case 'good':
        return 'default';
      case 'poor':
        return 'secondary';
      case 'critical':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <View className="p-4">
      {/* Main Status Card */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                {getStatusIcon()}
              </Animated.View>
              <CardTitle className="text-lg">Device Health</CardTitle>
            </View>
            <Badge variant={getBadgeVariant()}>
              <Text className="text-xs">
              {isOnline ? connectionQuality.charAt(0).toUpperCase() + connectionQuality.slice(1) : 'Offline'}
              </Text>
            </Badge>
          </View>
          <Text className="text-sm text-muted-foreground">
            {deviceId}
          </Text>
        </CardHeader>
        
        <CardContent>
          <View className="flex-row items-center gap-2 mb-4">
            <Activity className={cn("h-4 w-4", getStatusColor())} />
            <Text className={cn("font-medium", getStatusColor())}>
              Status: {isOnline ? 'Active' : 'Inactive'}
            </Text>
          </View>

          {/* Uptime */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Text className="text-sm text-muted-foreground">Uptime</Text>
            </View>
            <Text className="font-mono text-sm font-medium">
              {formatUptime(uptime)}
            </Text>
          </View>

          {/* Last Activity */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <Text className="text-sm text-muted-foreground">Last Activity</Text>
            </View>
            <Text className="text-sm font-medium">
              {Math.floor((Date.now() - lastActivity) / 1000)}s ago
            </Text>
          </View>
        </CardContent>
      </Card>

      {/* Network Metrics Card */}
      {healthData && isOnline && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Network Metrics</CardTitle>
          </CardHeader>
          <CardContent className="gap-4">
            {/* Signal Strength */}
            <View>
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2">
                  <Signal className="h-4 w-4 text-muted-foreground" />
                  <Text className="text-sm font-medium">Signal Strength</Text>
                </View>
                <Text className="text-sm font-medium">
                  {healthData.rssi} dBm
                </Text>
              </View>
              <Progress 
                value={getSignalStrength(healthData.rssi)} 
                className="h-2"
              />
              <Text className="text-xs text-muted-foreground mt-1">
                {getSignalStrength(healthData.rssi).toFixed(0)}% strength
              </Text>
            </View>

            {/* Latency */}
            <View>
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2">
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                  <Text className="text-sm font-medium">Network Latency</Text>
                </View>
                <Text className="text-sm font-medium">
                  {healthData.latency}ms
                </Text>
              </View>
              <Progress 
                value={Math.max(0, 100 - (healthData.latency / 5))} 
                className="h-2"
              />
              <Text className="text-xs text-muted-foreground mt-1">
                {healthData.latency < 150 ? 'Excellent' : 
                 healthData.latency < 250 ? 'Good' :
                 healthData.latency < 400 ? 'Fair' : 'Poor'} response time
              </Text>
            </View>

            {/* Timestamp */}
            <View className="flex-row items-center justify-between pt-2 border-t border-border">
              <Text className="text-xs text-muted-foreground">Last Check</Text>
              <Text className="text-xs font-medium">
                {new Date(healthData.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          </CardContent>
        </Card>
      )}

      {/* Health Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className={cn("text-2xl font-bold", getStatusColor())}>
                {isOnline ? '100' : '0'}%
              </Text>
              <Text className="text-sm text-muted-foreground">Availability</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-500">
                {healthData?.latency || '--'}
              </Text>
              <Text className="text-sm text-muted-foreground">Latency (ms)</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-500">
                {healthData ? getSignalStrength(healthData.rssi).toFixed(0) : '--'}
              </Text>
              <Text className="text-sm text-muted-foreground">Signal (%)</Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default HealthMonitor;