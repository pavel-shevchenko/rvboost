import { ItemTypeIfIterable } from './item-type-if-iterable.type';
import { ValueOf } from './value-of.type';

/**
 * Extract all the keys that meet the condition in the target and its sub-objects and
 * connect the keys using the separator.
 *
 * @param Visited - **DO NOT** specify this type!!! Used to prevent circular references.
 *
 * @example
 * type ObjType = {
 *   str: string;
 *   num: number;
 *   obj: { str: string; num: number; circular: ObjType };
 *   arr: { str: string; num: number; circular: ObjType }[];
 * };
 *
 * type T = ExtractPath<ObjType, string | number, number, "/">;
 * // type T = "str" | "obj/str" | "arr/str"
 */
export type ExtractPath<
  Target,
  Condition,
  Exclusion = never,
  Separator extends string = '.',
  Visited = Target
> = ValueOf<{
  [K in string & keyof Target]:
    | (ItemTypeIfIterable<Target[K]> extends Exclusion
        ? never
        : ItemTypeIfIterable<Target[K]> extends Condition
          ? K
          : never)
    | (ItemTypeIfIterable<Target[K]> extends Visited
        ? never
        : `${K}${Separator}${ExtractPath<
            ItemTypeIfIterable<Target[K]>,
            Condition,
            Exclusion,
            Separator,
            Visited | ItemTypeIfIterable<Target[K]>
          >}`);
}>;
