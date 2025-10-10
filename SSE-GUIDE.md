# Guide SSE (Server-Sent Events) avec MSAL

## Vue d'ensemble

Le `BaseMsalApiService` inclut désormais le support complet pour **Server-Sent Events (SSE)** avec authentification Azure AD automatique. SSE permet de recevoir des mises à jour en temps réel du serveur via une connexion HTTP persistante.

## Fonctionnalités SSE

### ✅ Avantages SSE
- ✅ Connexion unidirectionnelle (serveur → client)
- ✅ Reconnexion automatique
- ✅ Support natif du navigateur
- ✅ Pas besoin de WebSocket
- ✅ Fonctionne sur HTTP/HTTPS
- ✅ Plus simple que WebSocket pour les flux unidirectionnels

### 🔐 Avec Authentification MSAL
- Token Azure AD automatiquement acquis et injecté
- Rafraîchissement automatique des tokens expirés
- Gestion des erreurs d'authentification
- Support des scopes personnalisés

## Méthodes SSE Disponibles

### 1. `connectSSE<T>(endpoint, msalConfig?)`
Connexion SSE basique qui émet tous les messages reçus.

```typescript
protected connectSSE<T = any>(
  endpoint: string,
  msalConfig?: MsalApiConfig
): Observable<T>
```

### 2. `connectSSEWithEvents<T>(endpoint, eventTypes, msalConfig?)`
Connexion SSE avec filtrage par types d'événements spécifiques.

```typescript
protected connectSSEWithEvents<T = any>(
  endpoint: string,
  eventTypes: string[],
  msalConfig?: MsalApiConfig
): Observable<{ type: string; data: T }>
```

## Utilisation de Base

### Exemple 1 : Chat en Streaming

```typescript
import { Injectable } from '@angular/core';
import { BaseMsalApiService } from '@app/api';

@Injectable({ providedIn: 'root' })
export class ChatService extends BaseMsalApiService {

  streamChat(sessionId: string) {
    return this.connectSSE<string>(`chat/stream/${sessionId}`);
  }
}
```

Dans un composant :
```typescript
export class ChatComponent implements OnInit {
  private chatService = inject(ChatService);
  messages: string[] = [];

  ngOnInit() {
    this.chatService.streamChat('session-123').subscribe({
      next: (message) => {
        this.messages.push(message);
        console.log('New message:', message);
      },
      error: (error) => console.error('Stream error:', error),
      complete: () => console.log('Stream closed')
    });
  }
}
```

### Exemple 2 : Notifications en Temps Réel

```typescript
@Injectable({ providedIn: 'root' })
export class NotificationStreamService extends BaseMsalApiService {

  connectToNotifications() {
    return this.connectSSE<Notification>('notifications/stream');
  }
}
```

```typescript
export class AppComponent implements OnInit {
  private notificationStream = inject(NotificationStreamService);

  ngOnInit() {
    this.notificationStream.connectToNotifications().subscribe({
      next: (notification) => {
        this.showNotification(notification);
      }
    });
  }

  showNotification(notification: Notification) {
    // Afficher la notification à l'utilisateur
    console.log(notification.title, notification.message);
  }
}
```

### Exemple 3 : Plusieurs Types d'Événements

```typescript
@Injectable({ providedIn: 'root' })
export class EventStreamService extends BaseMsalApiService {

  connectToEvents() {
    return this.connectSSEWithEvents(
      'events/stream',
      ['chat', 'notification', 'status', 'update']
    );
  }
}
```

```typescript
export class DashboardComponent implements OnInit {
  private eventStream = inject(EventStreamService);

  ngOnInit() {
    this.eventStream.connectToEvents().subscribe({
      next: ({ type, data }) => {
        switch(type) {
          case 'chat':
            this.handleChatMessage(data);
            break;
          case 'notification':
            this.handleNotification(data);
            break;
          case 'status':
            this.updateStatus(data);
            break;
          case 'update':
            this.refreshData(data);
            break;
        }
      }
    });
  }
}
```

## Service SSE Complet Inclus

Un service `SseApiService` complet est fourni avec des exemples pour :

### 📨 Chat & Messaging
```typescript
// Chat streaming
streamChatCompletion(prompt: string, conversationId?: string)

// Chat messages
connectToChatStream(sessionId: string)
```

### 🔔 Notifications
```typescript
// Real-time notifications
connectToNotifications()
```

### 📊 Data Streaming
```typescript
// Live data updates
connectToDataStream<T>(dataType: string)

// Analytics streaming
streamAnalytics(metricType: string)

// Stock prices
streamStockPrices(symbols: string[])
```

### 📈 Progress Tracking
```typescript
// Task progress
trackProgress(taskId: string)
```

### 📝 Logs
```typescript
// Log streaming
streamLogs(logType: string)
```

### 🤝 Collaboration
```typescript
// Collaborative editing
connectToCollaborativeEditing(documentId: string)
```

### 🎮 Real-time Features
```typescript
// Game events
streamGameEvents(gameId: string)

// IoT devices
streamIoTDeviceData(deviceId: string)

// Health monitoring
monitorServerHealth()
```

## Configuration Backend

### Format des Messages SSE

Votre backend doit envoyer les messages au format SSE standard :

```
data: {"message": "Hello World"}\n\n
```

Ou avec un type d'événement :

```
event: chat\n
data: {"user": "John", "message": "Hi!"}\n\n
```

### Exemple Backend Node.js

```javascript
app.get('/chat/stream/:sessionId', (req, res) => {
  // Vérifier le token Azure AD
  const token = req.query.access_token;

  // Configurer les headers SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Envoyer des messages
  const sendMessage = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Exemple : Envoyer un message toutes les secondes
  const interval = setInterval(() => {
    sendMessage({ message: 'Hello', timestamp: new Date() });
  }, 1000);

  // Cleanup à la déconnexion
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});
```

### Exemple Backend Python (FastAPI)

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import asyncio
import json

app = FastAPI()

@app.get("/chat/stream/{session_id}")
async def stream_chat(session_id: str, access_token: str):
    async def event_generator():
        while True:
            # Votre logique ici
            data = {"message": "Hello", "timestamp": datetime.now().isoformat()}
            yield f"data: {json.dumps(data)}\n\n"
            await asyncio.sleep(1)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )
```

## Gestion du Token

### Option 1 : Token dans l'URL (Implémenté)
Le token est automatiquement ajouté en query parameter :
```
https://api.example.com/stream?access_token=eyJ0eXAi...
```

**Note** : EventSource ne supporte pas les headers personnalisés, donc le token doit être dans l'URL.

### Option 2 : Alternative avec Fetch API + EventSource Polyfill

Si vous avez besoin d'envoyer le token dans les headers :

```typescript
// Utiliser un polyfill EventSource qui supporte les headers
// npm install event-source-polyfill

import { EventSourcePolyfill } from 'event-source-polyfill';

protected connectSSEWithHeaders<T>(endpoint: string, token: string): Observable<T> {
  return new Observable(observer => {
    const eventSource = new EventSourcePolyfill(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    eventSource.onmessage = (event) => {
      observer.next(JSON.parse(event.data));
    };

    eventSource.onerror = (error) => {
      observer.error(error);
      eventSource.close();
    };

    return () => eventSource.close();
  });
}
```

## Gestion du Cycle de Vie

### Fermeture de la Connexion

```typescript
export class MyComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;

  ngOnInit() {
    this.subscription = this.sseService.connectToStream().subscribe({
      next: (data) => console.log(data)
    });
  }

  ngOnDestroy() {
    // Ferme automatiquement la connexion SSE
    this.subscription?.unsubscribe();
  }
}
```

### Reconnexion Automatique

SSE se reconnecte automatiquement en cas de déconnexion. Pour gérer manuellement :

```typescript
connectWithRetry(endpoint: string): Observable<any> {
  return this.connectSSE(endpoint).pipe(
    retry({
      count: 5,
      delay: (error, retryCount) => {
        console.log(`Retry attempt ${retryCount}`);
        return timer(1000 * retryCount); // Backoff exponentiel
      }
    })
  );
}
```

## Gestion des Erreurs

### Erreurs Courantes

```typescript
this.sseService.connectToStream().subscribe({
  next: (data) => console.log(data),
  error: (error) => {
    if (error.message.includes('Failed to acquire token')) {
      // Erreur d'authentification
      this.router.navigate(['/login']);
    } else if (error.message.includes('connection closed')) {
      // Connexion fermée par le serveur
      console.log('Reconnecting...');
      this.reconnect();
    } else {
      // Autre erreur
      console.error('Stream error:', error);
    }
  }
});
```

## Exemples Avancés

### Exemple 1 : Chat AI en Streaming

```typescript
@Component({
  selector: 'app-ai-chat',
  template: `
    <div class="chat-container">
      <div class="messages">
        <div *ngFor="let msg of messages">{{ msg }}</div>
      </div>
      <textarea [(ngModel)]="prompt"></textarea>
      <button (click)="sendMessage()">Send</button>
    </div>
  `
})
export class AIChatComponent {
  private sseService = inject(SseApiService);
  prompt = '';
  messages: string[] = [];
  currentResponse = '';

  sendMessage() {
    this.messages.push(`You: ${this.prompt}`);
    this.currentResponse = 'AI: ';

    this.sseService.streamChatCompletion(this.prompt).subscribe({
      next: (chunk) => {
        // Chaque chunk est ajouté à la réponse
        this.currentResponse += chunk;
      },
      complete: () => {
        this.messages.push(this.currentResponse);
        this.currentResponse = '';
      }
    });

    this.prompt = '';
  }
}
```

### Exemple 2 : Dashboard en Temps Réel

```typescript
@Component({
  selector: 'app-realtime-dashboard',
  template: `
    <div class="dashboard">
      <div class="metric" *ngFor="let metric of metrics">
        <h3>{{ metric.name }}</h3>
        <p>{{ metric.value }}</p>
      </div>
    </div>
  `
})
export class RealtimeDashboardComponent implements OnInit {
  private sseService = inject(SseApiService);
  metrics: any[] = [];

  ngOnInit() {
    // Connecter à plusieurs streams de données
    this.sseService.connectToDataStream('metrics').subscribe({
      next: (data) => {
        this.updateMetric(data);
      }
    });

    this.sseService.streamAnalytics('users').subscribe({
      next: (data) => {
        this.updateUserAnalytics(data);
      }
    });
  }

  updateMetric(data: any) {
    const index = this.metrics.findIndex(m => m.name === data.metric);
    if (index >= 0) {
      this.metrics[index].value = data.value;
    } else {
      this.metrics.push({ name: data.metric, value: data.value });
    }
  }
}
```

### Exemple 3 : Progress Bar en Temps Réel

```typescript
@Component({
  selector: 'app-task-progress',
  template: `
    <div class="progress-container">
      <h3>{{ taskName }}</h3>
      <div class="progress-bar">
        <div class="progress-fill" [style.width.%]="progress"></div>
      </div>
      <p>{{ statusMessage }}</p>
      <p>{{ progress }}%</p>
    </div>
  `
})
export class TaskProgressComponent implements OnInit {
  @Input() taskId!: string;
  private sseService = inject(SseApiService);

  taskName = '';
  progress = 0;
  statusMessage = '';

  ngOnInit() {
    this.sseService.trackProgress(this.taskId).subscribe({
      next: (update) => {
        this.progress = update.percentage;
        this.statusMessage = update.message;

        if (update.status === 'completed') {
          this.onTaskCompleted();
        }
      },
      error: (error) => {
        this.statusMessage = 'Error tracking progress';
        console.error(error);
      }
    });
  }

  onTaskCompleted() {
    console.log('Task completed!');
    // Afficher notification, rediriger, etc.
  }
}
```

## Sécurité

### Best Practices

1. **Validation du Token Côté Serveur**
   ```javascript
   // Backend: Toujours valider le token Azure AD
   const token = req.query.access_token;
   const isValid = await verifyAzureADToken(token);
   if (!isValid) {
     res.status(401).send('Unauthorized');
     return;
   }
   ```

2. **HTTPS Uniquement en Production**
   ```typescript
   // Les tokens ne doivent jamais être envoyés sur HTTP en production
   if (!environment.production && !url.startsWith('https://')) {
     console.warn('Warning: Sending token over HTTP');
   }
   ```

3. **Timeout des Connexions**
   ```typescript
   connectWithTimeout(endpoint: string): Observable<any> {
     return this.connectSSE(endpoint).pipe(
       timeout(60000), // 60 secondes
       catchError(error => {
         console.error('Connection timeout');
         return throwError(() => error);
       })
     );
   }
   ```

4. **Rate Limiting**
   Implémentez du rate limiting côté serveur pour éviter les abus.

## Performance

### Optimisations

1. **Limiter le Nombre de Connexions**
   ```typescript
   // Partagez les connexions SSE entre composants
   @Injectable({ providedIn: 'root' })
   export class SharedStreamService {
     private stream$ = this.sseService.connectToNotifications().pipe(
       shareReplay(1) // Partage la connexion
     );

     getStream() {
       return this.stream$;
     }
   }
   ```

2. **Fermer les Connexions Inutilisées**
   ```typescript
   // Toujours unsubscribe dans ngOnDestroy
   ngOnDestroy() {
     this.subscription?.unsubscribe();
   }
   ```

## Troubleshooting

### Problème : Connexion se ferme immédiatement
**Solution** : Vérifier que le serveur envoie bien les headers SSE corrects

### Problème : Token expiré
**Solution** : Le service gère automatiquement le refresh, mais vérifiez la configuration MSAL

### Problème : Messages non reçus
**Solution** : Vérifier le format des messages SSE côté serveur (doit finir par `\n\n`)

### Problème : CORS errors
**Solution** : Configurer CORS côté serveur pour accepter EventSource

## Documentation Complète

- **MSAL Integration Guide** : [MSAL-INTEGRATION-GUIDE.md](./MSAL-INTEGRATION-GUIDE.md)
- **SSE API Service** : [sse-api.service.ts](./src/app/api/sse-api.service.ts)
- **Base MSAL Service** : [base-msal-api.service.ts](./src/app/api/base-msal-api.service.ts)

## Ressources Externes

- [MDN: Using Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
- [SSE Specification](https://html.spec.whatwg.org/multipage/server-sent-events.html)
