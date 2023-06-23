import { EntityClass } from "@mikro-orm/core";
import Spec from "./Spec";

const TrueClass = new class extends Spec<object> {
  isSatisfiedBy(..._subs: object[]): boolean {
    return true;
  }
  toWhere() {
    return {
      '1': 1,
    };
  }
};

const True = <T extends object>(_: T | EntityClass<T>) => {
  return TrueClass as unknown as Spec<T>;
};

export default True;
