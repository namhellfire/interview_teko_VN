import React, { useCallback, useState, useMemo } from "react";
import propsType from "prop-types";
import { debounce, filter, split, map, toLower, intersection, orderBy, includes } from "lodash";
import { Input, AutoComplete } from "antd";

const { Search } = Input;

const SearchProduct = (props) => {
  const { data = [], onChange = () => {}, ...rest } = props; 
  const dataAutoComplete = useMemo(() => map(data, i => ({ value: i.name })), [data]);

  const replaceHighLightText = (string, keys) => {
    const arrStr = split(string, " ");
    const newArrStr = map(arrStr, i => {
      if (includes(keys,toLower(i))) {
        return `<span style="background-color: yellow">${i}</span>`
      } 
    return i;
    })
    return newArrStr.join(" ");
  }

  const onSearch = useCallback((val) => {
    if (val) {
      const listKeyword = split(toLower(val), " ");

      const newData = map(data, i => {
        const arrName = split(toLower(i.name), " ");
        const correctWord = intersection(listKeyword, arrName);
        const countCorrect = correctWord.length;
        
        if (countCorrect) {
          return {
            ...i,
            name,
            hightLightName: replaceHighLightText(i.name, correctWord),
            countCorrect,
          }
        }

        return i;

      })
      const result = filter(newData, i => i.countCorrect)
      const resultSort = orderBy(result,'countCorrect','desc');

      onChange(resultSort)
    } else {
      onChange(data)
    }
  }, [data, onChange]);


  return (
    <AutoComplete
      onSearch={debounce(onSearch, 800)}
      onSelect={onSearch}
      options={dataAutoComplete}
      placeholder="Search product"
      {...rest}
    >
      <Search />
    </AutoComplete>
  )
}

export default SearchProduct;

SearchProduct.prototype = {
  data: propsType.array,
}