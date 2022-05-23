// конфигурация библиотеки для работы с БЭМ
import { withNaming } from "@bem-react/classname";

export const cn = withNaming({
  n: "",
  e: "__",
  m: "_",
  v: "_",
});
