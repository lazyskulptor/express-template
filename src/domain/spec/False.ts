import { EntityClass } from "@mikro-orm/core";
import Spec from "./Spec";

const FalseClass = new class extends Spec<object> {
  isSatisfiedBy(..._subs: object[]): boolean {
    return true;
  }
  toWhere() {
    return {
      '1': 0,
    };
  }
};

const False = <T extends object>(_: T | EntityClass<T>) => {
  return FalseClass as unknown as Spec<T>;
};

export default False;
