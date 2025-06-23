import React, { useState } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { DeviceType } from '../lib/types';

// React Native Reusables imports
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';

// Icons
import { 
  User, 
  Car, 
  Heart, 
  Gauge, 
  Activity, 
  Smartphone,
  ArrowRight,
  CheckCircle
} from 'lucide-react-native';

interface Props {
  onConfig: (type: DeviceType) => void;
}

const DeviceConfig: React.FC<Props> = ({ onConfig }) => {
  const [selectedType, setSelectedType] = useState<DeviceType | null>(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  const deviceOptions = [
    {
      type: 'Human' as DeviceType,
      title: 'Human Device',
      subtitle: 'Health & Wellness Monitoring',
      description: 'Monitor vital signs, activity levels, and health metrics in real-time',
      icon: User,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      features: ['Heart Rate Monitoring', 'Fatigue Detection', 'Activity Tracking', 'Health Alerts'],
      metrics: [
        { icon: Heart, label: 'Heart Rate', value: '60-120 BPM' },
        { icon: Activity, label: 'Activity', value: 'Real-time' }
      ]
    },
    {
      type: 'Vehicle' as DeviceType,
      title: 'Vehicle Device', 
      subtitle: 'Machine Performance Tracking',
      description: 'Track vehicle performance, engine status, and operational metrics',
      icon: Car,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      features: ['Speed Monitoring', 'Engine Diagnostics', 'Performance Analytics', 'Fault Detection'],
      metrics: [
        { icon: Gauge, label: 'Speed', value: '0-120 km/h' },
        { icon: Smartphone, label: 'Engine', value: 'Status Check' }
      ]
    }
  ];

  const handleSelection = (type: DeviceType) => {
    setSelectedType(type);
    
    // Scale animation for feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleConfirm = () => {
    if (selectedType) {
      onConfig(selectedType);
    }
  };

  return (
    <View className="gap-6">
      {/* Header */}
      <View className="items-center mb-2">
        <Text className="text-2xl font-bold text-center mb-2">
          Choose Device Type
        </Text>
        <Text className="text-base text-muted-foreground text-center">
          Select the type of device you want to configure for monitoring
        </Text>
      </View>

      {/* Device Options */}
      <View className="gap-4">
        {deviceOptions.map((option) => {
          const IconComponent = option.icon;
          const isSelected = selectedType === option.type;
          
          return (
            <Animated.View
              key={option.type}
              style={{
                transform: [{ scale: isSelected ? scaleAnim : 1 }]
              }}
            >
              <Pressable onPress={() => handleSelection(option.type)}>
                <Card 
                  className={cn(
                    "border-2 transition-all duration-200",
                    isSelected 
                      ? `${option.borderColor} bg-opacity-50 ${option.bgColor}` 
                      : "border-border bg-card"
                  )}
                >
                  <CardContent className="p-6">
                    {/* Header Section */}
                    <View className="flex-row items-start justify-between mb-4">
                      <View className="flex-row items-center gap-3 flex-1">
                        <View className={cn(
                          "p-3 rounded-full",
                          isSelected ? option.bgColor : "bg-muted"
                        )}>
                          <IconComponent 
                            className={cn(
                              "h-6 w-6",
                              isSelected ? option.color : "text-muted-foreground"
                            )} 
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-lg font-semibold">
                            {option.title}
                          </Text>
                          <Text className="text-sm text-muted-foreground">
                            {option.subtitle}
                          </Text>
                        </View>
                      </View>
                      
                      {isSelected && (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      )}
                    </View>

                    {/* Description */}
                    <Text className="text-sm text-muted-foreground mb-4">
                      {option.description}
                    </Text>

                    {/* Metrics Preview */}
                    <View className="flex-row gap-4 mb-4">
                      {option.metrics.map((metric, index) => {
                        const MetricIcon = metric.icon;
                        return (
                          <View key={index} className="flex-1 items-center p-2 bg-muted/50 rounded-lg">
                            <MetricIcon className="h-4 w-4 text-muted-foreground mb-1" />
                            <Text className="text-xs font-medium">{metric.label}</Text>
                            <Text className="text-xs text-muted-foreground">{metric.value}</Text>
                          </View>
                        );
                      })}
                    </View>

                    {/* Features */}
                    <View className="gap-2">
                      <Text className="text-sm font-medium">Key Features:</Text>
                      <View className="flex-row flex-wrap gap-1">
                        {option.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </View>
                    </View>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <View className="mt-4 pt-4 border-t border-border">
                        <View className="flex-row items-center justify-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <Text className="text-sm font-medium text-green-600">
                            Selected for Configuration
                          </Text>
                        </View>
                      </View>
                    )}
                  </CardContent>
                </Card>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      {/* Confirm Button */}
      {selectedType && (
        <View className="mt-6">
          <Button 
            onPress={handleConfirm}
            className="h-14 flex-row items-center justify-center gap-2"
          >
            <Text className="text-white font-medium text-lg">
              Configure as {selectedType}
            </Text>
            <ArrowRight className="h-5 w-5 text-white ml-2" />
          </Button>
        </View>
      )}

      {/* Help Text */}
      <View className="mt-4 p-4 bg-muted/30 rounded-lg">
        <Text className="text-xs text-muted-foreground text-center">
          💡 You can change the device type later by resetting the configuration
        </Text>
      </View>
    </View>
  );
};

export default DeviceConfig;