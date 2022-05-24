import React, { FC, useEffect } from "react";
import classNames from "classnames/dedupe";
import { cn } from "src/helpers/bem";
import { Props } from "./props";
import "./History.scss";
import { Tag } from "src/components";
import { observer } from "mobx-react-lite";
import { fetchEvents } from "src/mobx/history/services/fetchEvents";

const b = cn("history-page");

export const HistoryPage: FC<Props> = observer((props) => {
  const { className } = props;

  useEffect(() => {
    fetchEvents();
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
