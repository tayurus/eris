import React, { FC, useEffect, useState } from "react";
import classNames from "classnames/dedupe";
import { cn } from "src/helpers/bem";
import { Props } from "./props";
import "./History.scss";
import { Tag } from "src/components";
import { observer } from "mobx-react-lite";
import { fetchEvents } from "src/mobx/history/services/fetchEvents";
import { HistoryModule } from "src/mobx/history";
import { Event } from "src/types/Event";
import { ResourceLabel } from "src/types/ResourceLabel";
import { toJS } from "mobx";
import { fetchResources } from "src/mobx/history/services/fetchResources";
import { Resource } from "src/types/Resource";

const b = cn("history-page");

type SortedDataItem = Partial<Event & Resource>;

type SortedData = Record<string, Record<ResourceLabel, Array<SortedDataItem>>>;

export const HistoryPage: FC<Props> = observer((props) => {
  const { className } = props;
  const [sortedData, setSortedData] = useState<SortedData>({});
  // преобразовываем этот объект в массив id, которые будем запрашивать по 15 штук из resources
  // берем ключи итогового объекта как массив и сортируем их по дате
  const dateKeysSorted = getSortedDateKeys(sortedData);
  const resources = toJS(HistoryModule.getResources());

  // {
  //   '28-03-2022': {
  //     'appoitment': [{id}],
  //     'observtaion': [],
  //     'condition': [],
  //   },
  //   '29-03-2022': {
  //     'appoitment': [],
  //     'observtaion': [],
  //     'condition': [],
  //   },
  // }

  function updateSortedData(resources: Resource[]) {
    const sortedDataCopy = JSON.parse(JSON.stringify(sortedData));

    // идем по всем датам
    Object.keys(sortedData).forEach((date) => {
      // идем по всем ресурсам
      Object.keys(sortedData[date]).forEach((resourceKey) => {
        // идем по всем событиям внутри данного ресурса
        sortedData[date][resourceKey as ResourceLabel].forEach((resource, index) => {
          const resourceId = `${resource.resource}/${resource.id}`;
          const resourceIndex = resources.map((it) => it.id).indexOf(resourceId);

          if (resourceIndex !== -1) {
            const eventForUpdate = sortedData[date][resourceKey as ResourceLabel][index];
            const updateData = resources[resourceIndex];
            sortedDataCopy[date][resourceKey as ResourceLabel][index] = { ...eventForUpdate, ...updateData };
          }
        });
      });
    });

    setSortedData(sortedDataCopy);
  }

  function getSortedDateKeys(sortedData: SortedData) {
    console.log("sortedData", sortedData);
    return Object.keys(sortedData).sort((a, b) => +new Date(b) - +new Date(a));
  }

  function getEventsIdsInCorrectOrder(events: Event[]) {
    // генерируем объект с итоговой структурой
    const sortedData: SortedData = {};

    // идем по всем events
    events.forEach((event) => {
      // берем дату данного event без времени
      const dateWithoutTime = event.date;

      // если в итоговом объекте нет ключа с данной датой
      if (!sortedData[dateWithoutTime]) {
        // создаем данный ключ
        sortedData[dateWithoutTime] = {
          Appointment: [],
          AllergyIntolerance: [],
          CarePlan: [],
          Condition: [],
          Immunization: [],
          MedicationStatement: [],
          Observation: [],
          Procedure: [],
        };
      }

      // если по данной дате уже есть массив с ключом resource
      if (sortedData[dateWithoutTime][event.resource]) {
        // пушим в этот массив данный event
        sortedData[dateWithoutTime][event.resource].push(event);
      }
    });

    setSortedData(sortedData);

    // итоговый массив со всеми id в том порядке, в котором их нужно запрашивать с бека
    const ids: string[] = [];
    const dateKeysSorted = getSortedDateKeys(sortedData);
    // идем по объектам, которые принадлежат отсортированым датам
    dateKeysSorted.forEach((dateKey) => {
      // идем по ключам данного обьекта и пушим в итоговый массив id
      Object.values(sortedData[dateKey]).forEach((eventArray) =>
        eventArray.forEach((event) => ids.push(`${event.resource}/${event.id}`))
      );
    });

    return ids;
  }

  function renderDetails(event: SortedDataItem) {
    if (event.details) {
      if (Array.isArray(event.values) && event.values.length) {
        return `${event.details}: ${event.values.join(",")}`;
      }
      return event.details;
    }

    return "";
  }

  useEffect(() => {
    const getData = async () => {
      const events: Event[] = await fetchEvents();
      HistoryModule.setEvents(events);
      const ids = getEventsIdsInCorrectOrder(events);
      const resources = await fetchResources(ids.slice(0, 15));
      HistoryModule.pushResources(resources);
    };
    getData();
  }, []);

  useEffect(() => {
    updateSortedData(resources);
  }, [resources.length]);

  return (
    <div className={classNames(b(), className, "site-container")}>
      <table className={classNames(b("table"), className)}>
        <thead>
          <tr>
            <th>Event type</th>
            <th>Details</th>
            <th>Code</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {dateKeysSorted.map((date) => {
            return Object.keys(sortedData[date]).map((resource) => {
              return (
                <tr>
                  <td>
                    <Tag text={resource} color="blue" />
                  </td>

                  <td>
                    {sortedData[date][resource as ResourceLabel].map((event) => {
                      return <p>{renderDetails(event)}</p>;
                    })}
                  </td>

                  <td>
                    {sortedData[date][resource as ResourceLabel].map((event) => {
                      return <p>{event.code}</p>;
                    })}
                  </td>

                  <td>
                    <p>{new Date(date).toDateString().slice(4)}</p>
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
});
