import { makeAutoObservable } from "mobx";
import { Event } from "src/types/Event";

export class History {
  events: Event[] = [];
  resources: any = [];

  constructor() {
    makeAutoObservable(this);
  }

  set setEvents(events: Event[]) {
    this.events = events;
  }
}
