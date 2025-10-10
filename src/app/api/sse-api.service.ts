import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseMsalApiService } from './base-msal-api.service';

/**
 * SSE Event Types
 */
export interface SSEMessage<T = any> {
  id?: string;
  event?: string;
  data: T;
  timestamp?: string;
}

/**
 * Chat Message Interface
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

/**
 * Notification Interface
 */
export interface RealtimeNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
}

/**
 * Stream Status Interface
 */
export interface StreamStatus {
  status: 'connected' | 'disconnected' | 'error';
  message?: string;
}

/**
 * SSE API Service with MSAL Authentication
 * Demonstrates how to use Server-Sent Events (SSE) with Azure AD authentication
 * 
 * Use cases:
 * - Real-time chat streaming
 * - Live notifications
 * - Real-time data updates
 * - Progress tracking
 * - Live logs streaming
 */
@Injectable({
  providedIn: 'root'
})
export class SseApiService extends BaseMsalApiService {

  /**
   * Connect to chat stream
   * Receives real-time chat messages from the server
   * 
   * @param sessionId - Chat session identifier
   * @returns Observable that emits chat messages as they arrive
   * 
   * @example
   * ```typescript
   * this.sseService.connectToChatStream('session-123').subscribe({
   *   next: (message) => console.log('New message:', message),
   *   error: (error) => console.error('Stream error:', error),
   *   complete: () => console.log('Stream closed')
   * });
   * ```
   */
  connectToChatStream(sessionId: string): Observable<ChatMessage> {
    return this.connectSSE<ChatMessage>(`chat/stream/${sessionId}`);
  }

  /**
   * Connect to chat stream with AI completion
   * Streams AI-generated responses in real-time
   * 
   * @param prompt - The user's prompt
   * @param conversationId - Optional conversation ID for context
   * @returns Observable that emits text chunks as they're generated
   */
  streamChatCompletion(prompt: string, conversationId?: string): Observable<string> {
    const endpoint = conversationId 
      ? `chat/completion?conversationId=${conversationId}`
      : 'chat/completion';
    
    return this.connectSSE<string>(endpoint);
  }

  /**
   * Connect to notifications stream
   * Receives real-time notifications from the server
   * 
   * @returns Observable that emits notifications
   * 
   * @example
   * ```typescript
   * this.sseService.connectToNotifications().subscribe(notification => {
   *   this.notificationService.show(notification);
   * });
   * ```
   */
  connectToNotifications(): Observable<RealtimeNotification> {
    return this.connectSSE<RealtimeNotification>('notifications/stream');
  }

  /**
   * Connect to live data updates
   * Receives real-time data updates for dashboards
   * 
   * @param dataType - Type of data to stream (e.g., 'metrics', 'analytics')
   * @returns Observable that emits data updates
   */
  connectToDataStream<T = any>(dataType: string): Observable<T> {
    return this.connectSSE<T>(`data/stream/${dataType}`);
  }

  /**
   * Connect to progress tracking stream
   * Tracks progress of long-running operations
   * 
   * @param taskId - Task identifier
   * @returns Observable that emits progress updates
   * 
   * @example
   * ```typescript
   * this.sseService.trackProgress('task-456').subscribe(progress => {
   *   this.progressBar.value = progress.percentage;
   * });
   * ```
   */
  trackProgress(taskId: string): Observable<{ percentage: number; message: string; status: string }> {
    return this.connectSSE(`tasks/${taskId}/progress`);
  }

  /**
   * Connect to log streaming
   * Streams real-time logs from the server
   * 
   * @param logType - Type of logs ('application', 'system', 'error')
   * @returns Observable that emits log entries
   */
  streamLogs(logType: string = 'application'): Observable<{ level: string; message: string; timestamp: string }> {
    return this.connectSSE(`logs/stream?type=${logType}`);
  }

  /**
   * Connect to events stream with specific event types
   * Listens to multiple SSE event types
   * 
   * @param eventTypes - Array of event types to listen for
   * @returns Observable that emits events with their types
   * 
   * @example
   * ```typescript
   * this.sseService.connectToEvents(['chat', 'notification', 'status']).subscribe({
   *   next: ({ type, data }) => {
   *     switch(type) {
   *       case 'chat': this.handleChat(data); break;
   *       case 'notification': this.handleNotification(data); break;
   *       case 'status': this.handleStatus(data); break;
   *     }
   *   }
   * });
   * ```
   */
  connectToEvents<T = any>(eventTypes: string[]): Observable<{ type: string; data: T }> {
    return this.connectSSEWithEvents<T>('events/stream', eventTypes);
  }

  /**
   * Connect to custom SSE endpoint
   * Generic method for custom SSE connections
   * 
   * @param endpoint - Custom endpoint path
   * @param scopes - Optional custom Azure AD scopes
   * @returns Observable that emits data from the stream
   */
  connectToCustomStream<T = any>(endpoint: string, scopes?: string[]): Observable<T> {
    return this.connectSSE<T>(endpoint, { scopes });
  }

  /**
   * Connect to health check stream
   * Monitors server health in real-time
   * 
   * @returns Observable that emits health status
   */
  monitorServerHealth(): Observable<{ status: string; uptime: number; lastCheck: string }> {
    return this.connectSSE('health/stream');
  }

  /**
   * Connect to collaborative editing stream
   * Receives real-time updates for collaborative document editing
   * 
   * @param documentId - Document identifier
   * @returns Observable that emits document changes
   */
  connectToCollaborativeEditing(documentId: string): Observable<{
    userId: string;
    operation: 'insert' | 'delete' | 'update';
    position: number;
    content: string;
  }> {
    return this.connectSSE(`documents/${documentId}/collaborate`);
  }

  /**
   * Connect to real-time analytics stream
   * Streams analytics data for live dashboards
   * 
   * @param metricType - Type of metric to stream
   * @returns Observable that emits metric data
   */
  streamAnalytics(metricType: string): Observable<{
    metric: string;
    value: number;
    timestamp: Date;
    metadata?: Record<string, any>;
  }> {
    return this.connectSSE(`analytics/stream/${metricType}`);
  }

  /**
   * Connect to IoT device stream
   * Receives real-time data from IoT devices
   * 
   * @param deviceId - Device identifier
   * @returns Observable that emits device telemetry
   */
  streamIoTDeviceData(deviceId: string): Observable<{
    deviceId: string;
    sensorData: Record<string, number>;
    timestamp: Date;
  }> {
    return this.connectSSE(`iot/devices/${deviceId}/stream`);
  }

  /**
   * Connect to stock price stream
   * Receives real-time stock price updates
   * 
   * @param symbols - Array of stock symbols
   * @returns Observable that emits price updates
   */
  streamStockPrices(symbols: string[]): Observable<{
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    timestamp: Date;
  }> {
    const symbolsParam = symbols.join(',');
    return this.connectSSE(`market/stream?symbols=${symbolsParam}`);
  }

  /**
   * Connect to game events stream
   * Receives real-time game events for multiplayer games
   * 
   * @param gameId - Game session identifier
   * @returns Observable that emits game events
   */
  streamGameEvents(gameId: string): Observable<{
    eventType: string;
    playerId: string;
    data: any;
    timestamp: Date;
  }> {
    return this.connectSSE(`games/${gameId}/events`);
  }
}
