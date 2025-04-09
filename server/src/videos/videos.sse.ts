import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

export interface ClientEvent {
  clientId: string;
  data: any;
  type?: string;
}

export enum VideosSseEvents {
  SUCCESS = 'video-processing-success',
  PROGRESS = 'video-processing-progress',
  ERROR = 'video-processing-error'
}

@Injectable()
export class VideosSseService {
  private clients = new Map<string, Subject<ClientEvent>>();

  addClient(clientId: string): Observable<ClientEvent> {
    const subject = new Subject<ClientEvent>();
    this.clients.set(clientId, subject);
    return subject.asObservable();
  }

  removeClient(clientId: string): void {
    if (this.clients.has(clientId)) {
      this.clients.get(clientId)?.complete();
      this.clients.delete(clientId);
    }
  }

  sendToClient(clientId: string, data: any, type = 'message'): boolean {
    if (this.clients.has(clientId)) {
      this.clients.get(clientId)?.next({ clientId, data, type });
      return true;
    }
    return false;
  }
}
