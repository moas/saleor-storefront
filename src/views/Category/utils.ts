import { Attribute } from "@graphql/gqlTypes/Attribute";
import { AttributeList } from "@temp/components/ProductFilters";
import { IFilters } from "@types";
import { UknownObject } from "@utils/tsUtils";

export const handleFiltersChange = (
  filters: IFilters,
  attributeFilters: UknownObject<string[]>,
  setAttributeFilters: (newValue: UknownObject<string[]>) => void
) => (name: string, value: string) => {
  if (attributeFilters && attributeFilters.hasOwnProperty(name)) {
    if (attributeFilters[name].includes(value)) {
      if (filters.attributes[`${name}`].length === 1) {
        const att = { ...attributeFilters };
        delete att[`${name}`];
        setAttributeFilters({
          ...att,
        });
      } else {
        setAttributeFilters({
          ...attributeFilters,
          [`${name}`]: attributeFilters[`${name}`].filter(
            item => item !== value
          ),
        });
      }
    } else {
      setAttributeFilters({
        ...attributeFilters,
        [`${name}`]: [...attributeFilters[`${name}`], value],
      });
    }
  } else {
    setAttributeFilters({ ...attributeFilters, [`${name}`]: [value] });
  }
};

export const getActiveFilterAttributes = (
  filterAttributes: AttributeList | undefined,
  attributes: Attribute[]
) => {
  const getAttribute = (attributeSlug: string, valueSlug: string) => ({
    attributeSlug,
    valueName: attributes
      .find(({ slug }) => attributeSlug === slug)
      .values.find(({ slug }) => valueSlug === slug).name,
    valueSlug,
  });

  return (
    filterAttributes &&
    Object.keys(filterAttributes).reduce(
      (acc, key) =>
        acc.concat(
          filterAttributes[key].map(valueSlug => getAttribute(key, valueSlug))
        ),
      []
    )
  );
};
