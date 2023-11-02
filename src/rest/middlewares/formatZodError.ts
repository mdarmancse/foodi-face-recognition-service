import { isEmpty, omit } from "lodash";
import { ZodError } from "zod";

type _ErrorsKey = "_errors";
type _ZodPropErrors = { _errors: string[] };
type _ZodError = {
  [key: string | _ErrorsKey]: _ZodPropErrors | string[];
};

export function formatZodError(err: ZodError) {
  const obj = err?.format() || {};
  return parseObject(obj);
}

function parseObject(obj: _ZodError) {
  let rv: any = {};

  for (const key in obj) {
    if (!key.startsWith("_errors")) {
      if (isArrayError(obj[key] as _ZodError)) {
        rv[key] = parseArray(obj[key] as _ZodPropErrors);
      } else {
        rv[key] = (obj[key] as _ZodPropErrors)._errors[0] || "Invalid data";
      }
      // console.log({[key]: obj[key], isArray: isArrayError(obj[key])});
    }
  }

  if (isEmpty(omit(obj, "_errors"))) {
    rv = (obj["_errors"] as string[])[0] || "Invalid data";
  }

  return rv;
}

function parseArray(obj: _ZodError) {
  const rv = [];
  for (const key in obj) {
    if (!isNaN(parseInt(key))) {
      const err = parseObject(obj[key] as _ZodPropErrors);
      rv[parseInt(key)] = err;
    }
  }
  return rv;
}

function isArrayError(obj: _ZodError) {
  for (const key in obj) {
    if (!isNaN(parseInt(key))) {
      return true;
    }
  }
  return false;
}
