import React, { FC, useEffect } from "react";
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

const b = cn("history-page");

export const HistoryPage: FC<Props> = observer((props) => {
  const { className } = props;

  // {
  //   '28-03-2022': {
  //     'appoitment': [],
  //     'observtaion': [],
  //     'condition': [],
  //   },
  //   '29-03-2022': {
  //     'appoitment': [],
  //     'observtaion': [],
  //     'condition': [],
  //   },
  // }

  function getEventsIdsInCorrectOrder(events: Event[]) {
    // генерируем объект с итоговой структурой
    const sortedData: Record<string, Record<ResourceLabel, Event[]>> = {};

    // идем по всем events
    events.forEach((event) => {
      // берем дату данного event без времени
      const dateWithoutTime = event.date.slice(0, 10);

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

    // итоговый массив со всеми id в том порядке, в котором их нужно запрашивать с бека
    const ids: string[] = [];

    // преобразовываем этот объект в массив id, которые будем запрашивать по 15 штук из resources
    // берем ключи итогового объекта как массив и сортируем их по дате
    const dateKeysSorted = Object.keys(sortedData).sort((a, b) => +new Date(b) - +new Date(a));

    // идем по объектам, которые принадлежат отсортированым датам
    dateKeysSorted.forEach((dateKey) => {
      // идем по ключам данного обьекта и пушим в итоговый массив id
      Object.values(sortedData[dateKey]).forEach((eventArray) =>
        eventArray.forEach((event) => ids.push(`${event.resource}/${event.id}`))
      );
    });

    return ids;
  }

  useEffect(() => {
    const getData = async () => {
      const events: Event[] = await fetchEvents();
      HistoryModule.setEvents(events);
      const ids = getEventsIdsInCorrectOrder(events);
      fetchResources(ids.slice(0, 15));
    };
    getData();
  }, []);

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
          <tr>
            <td>
              <Tag text="Appointment" color="light-green" />
            </td>
            <td>
              <p>At home exam</p>
            </td>
            <td></td>
            <td>
              <p>Mar 28, 2022</p>
            </td>
          </tr>
          <tr>
            <td>
              <Tag text="Appointment" color="blue" />
            </td>
            <td>
              <p>At home exam</p>
              <p>At home exam2</p>
              <p>At home exam3</p>
            </td>
            <td></td>
            <td>
              <p>Mar 28, 2022</p>
              <p className="disabled">Mar 28, 2022</p>
              <p className="disabled">Mar 28, 2022</p>
            </td>
          </tr>
          <tr>
            <td>
              <Tag text="Appointment" color="peach" />
            </td>
            <td>
              <p>At home exam t home exam t home exam t home exam t home exam t home exam t home exam</p>
            </td>
            <td>228073543B</td>
            <td>Mar 28, 2022</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});
