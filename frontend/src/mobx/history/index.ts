import { makeAutoObservable } from "mobx";
import { Event } from "src/types/Event";
import { Resource } from "src/types/Resource";

class History {
  events: Event[] = [];
  resources: Resource[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setEvents(events: Event[]) {
    this.events = events;
  }

  pushResources(resources: Resource[]) {
    this.resources = this.resources.concat(resources);
  }

  getResources() {
    return this.resources;
  }

  getEvents() {
    return this.events;
  }
}

export const HistoryModule = new History();
