import { makeAutoObservable } from "mobx";
import { Event } from "src/types/Event";

class History {
  events: Event[] = [];
  resources: any = [];

  constructor() {
    makeAutoObservable(this);
  }

  setEvents(events: Event[]) {
    this.events = events;
  }


  getEvents() {
    return this.events
  }
}

export const  HistoryModule = new History();

