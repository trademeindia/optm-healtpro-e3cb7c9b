
import { supabase } from '@/integrations/supabase/client';
import { HealthMetric, HealthMetricType, TimeRange } from './types';

/**
 * Service for retrieving and managing health metrics
 */
export class HealthMetricsService {
  // Cache for quick access to the latest metrics
  private metricCache: Map<string, HealthMetric> = new Map();
  
  /**
   * Get health metrics for a specific user
   */
  public async getHealthMetrics(
    userId: string,
    metricType?: HealthMetricType,
    timeRange: TimeRange = 'week',
    limit: number = 100
  ): Promise<HealthMetric[]> {
    try {
      let query = supabase
        .from('fitness_data')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })
        .limit(limit);
        
      if (metricType) {
        query = query.eq('data_type', metricType);
      }
      
      // Apply time range filter
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case 'day':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      query = query.gte('start_time', startDate.toISOString());
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data.map(item => ({
        id: item.id,
        userId: item.user_id,
        type: item.data_type as HealthMetricType,
        value: Number(item.value),
        unit: item.unit,
        timestamp: item.start_time,
        source: item.source,
        metadata: item.metadata ? (item.metadata as Record<string, any>) : undefined
      })) as HealthMetric[];
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      return [];
    }
  }
  
  /**
   * Get the latest value for a specific metric
   */
  public async getLatestMetric(
    userId: string,
    metricType: HealthMetricType
  ): Promise<HealthMetric | null> {
    try {
      // Check cache first
      const cacheKey = `${userId}:${metricType}`;
      if (this.metricCache.has(cacheKey)) {
        return this.metricCache.get(cacheKey) || null;
      }
      
      const { data, error } = await supabase
        .from('fitness_data')
        .select('*')
        .eq('user_id', userId)
        .eq('data_type', metricType)
        .order('start_time', { ascending: false })
        .limit(1);
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const metric: HealthMetric = {
          id: data[0].id,
          userId: data[0].user_id,
          type: data[0].data_type as HealthMetricType,
          value: Number(data[0].value),
          unit: data[0].unit,
          timestamp: data[0].start_time,
          source: data[0].source,
          metadata: data[0].metadata ? (data[0].metadata as Record<string, any>) : undefined
        };
        
        // Cache the result
        this.metricCache.set(cacheKey, metric);
        
        return metric;
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching latest ${metricType} metric:`, error);
      return null;
    }
  }

  /**
   * Update cache with new metric data
   */
  public updateCache(metric: HealthMetric): void {
    const cacheKey = `${metric.userId}:${metric.type}`;
    this.metricCache.set(cacheKey, metric);
  }
}

export const healthMetricsService = new HealthMetricsService();
