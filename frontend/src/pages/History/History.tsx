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
import InfiniteScroll from "react-infinite-scroller";
import { Loader } from "src/components";
import { AppointmentMap } from "src/helpers/constants";
import { SortedDataItem } from "src/types/SortedDataItem";
import { renderDetails } from "src/helpers/detailts";
import { sortEvents } from "src/helpers/events";

const b = cn("history-page");

type SortedData = Record<string, Record<ResourceLabel, Array<SortedDataItem>>>;

const ENTRIES_PER_PAGE = 15;
const INITIAL_PAGE = 3;
const MOBILE_BREAKPOINT = 639;

export const HistoryPage: FC<Props> = observer((props) => {
  const { className } = props;
  const [sortedData, setSortedData] = useState<SortedData>({});
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ids, setIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  // преобразовываем этот объект в массив id, которые будем запрашивать по 15 штук из resources
  // берем ключи итогового объекта как массив и сортируем их по дате
  const dateKeysSorted = getSortedDateKeys(sortedData);
  const resources = toJS(HistoryModule.getResources());
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
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
    return Object.keys(sortedData).sort((a, b) => +new Date(b) - +new Date(a));
  }

  /**
   * Преобразовывает все данные в объект вида
   // {
   //   '28-03-2022': {
   //     'appointment': [{id: 123, value: {}}],
   //     'observation': [],
   //     'condition': [],
   //   },
   //   '29-03-2022': {
   //     'appointment': [],
   //     'observation': [],
   //     'condition': [],
   //   },
   // }
   * */
  function getEventsIdsInCorrectOrder(events: Event[]) {
    // генерируем объект с итоговой структурой
    const sortedData: SortedData = {};

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

  async function loadMore() {
    if (currentPage * ENTRIES_PER_PAGE <= ids.length) {
      setLoading(true);
      setHasMore(false);
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const resources = await fetchResources(
        ids.slice((currentPage - 1) * ENTRIES_PER_PAGE, currentPage * ENTRIES_PER_PAGE)
      );
      HistoryModule.pushResources(resources);
      updateSortedData(resources);
      setCurrentPage(currentPage + 1);
      setHasMore(true);
      setLoading(false);
    } else {
      setHasMore(false);
    }
  }

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const events: Event[] = await fetchEvents();
      HistoryModule.setEvents(events);
      const ids = getEventsIdsInCorrectOrder(events);
      setIds(ids);
      const resources = await fetchResources(ids.slice(0, ENTRIES_PER_PAGE * currentPage));
      setLoading(false);
      HistoryModule.pushResources(resources);
    };
    getData();

    return () => {
      HistoryModule.clearEvents();
      HistoryModule.clearResources();
    };
  }, []);

  useEffect(() => {
    updateSortedData(resources);
  }, [resources.length]);

  let drawedEventsCount = 0;

  return (
    <div className={classNames(b(), className, "site-container")}>
      {loading && <Loader />}
      <InfiniteScroll
        threshold={1000}
        useWindow={true}
        initialLoad={false}
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMore}
      >
        {isMobile ? (
          <table className={classNames(b("table-mobile"), className)}>
            <tbody>
              {dateKeysSorted.map((date) => {
                return Object.keys(sortedData[date]).map((resource) => {
                  if (
                    !sortedData[date][resource as ResourceLabel].length ||
                    drawedEventsCount >= currentPage * ENTRIES_PER_PAGE
                  ) {
                    return null;
                  }
                  return (
                    <tr key={`${date}-${resource}-${drawedEventsCount}`}>
                      <td>
                        <div className={classNames(b("table-mobile-cell"))}>
                          <Tag text={resource} color={AppointmentMap[resource as ResourceLabel]} />
                          <p>{new Date(date).toDateString().slice(4)}</p>
                          <div className={classNames(b("table-mobile-items"))}>
                            {sortedData[date][resource as ResourceLabel].sort(sortEvents).map((event) => {
                              drawedEventsCount++;
                              return (
                                <div key={event.id} className={classNames(b("table-mobile-item"))}>
                                  <p className={b("details")}>{renderDetails(event)}</p>
                                  <p>{event.code}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        ) : (
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
                  if (
                    !sortedData[date][resource as ResourceLabel].length ||
                    drawedEventsCount >= currentPage * ENTRIES_PER_PAGE
                  ) {
                    return null;
                  }
                  return sortedData[date][resource as ResourceLabel].sort(sortEvents).map((event, index, arr) => {
                    drawedEventsCount++;
                    return (
                      <tr
                        key={`${date}-${resource}-${drawedEventsCount}`}
                        style={{ borderBottom: index === arr.length - 1 ? "1px solid #e1e1e1" : "none" }}
                      >
                        {index === 0 ? (
                          <td>
                            <Tag text={resource} color={AppointmentMap[resource as ResourceLabel]} />
                          </td>
                        ) : (
                          <td></td>
                        )}
                        <td>
                          <p className={b("details")}>{renderDetails(event)}</p>
                        </td>
                        <td>
                          <p>{event.code}</p>
                        </td>
                        <td>
                          <p style={{ opacity: index !== 0 ? 0.3 : 1 }}>{new Date(date).toDateString().slice(4)}</p>
                        </td>
                      </tr>
                    );
                  });
                });
              })}
            </tbody>
          </table>
        )}
      </InfiniteScroll>
    </div>
  );
});
