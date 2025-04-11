import { useState } from 'react';
import { useMultiSelect, multiSelect } from '@szhsin/react-autocomplete';
interface SymptomsSelectProps {
    selected: string[];
    setSelected: React.Dispatch<React.SetStateAction<string[]>>;
    DATASET: string[];
}
const SymptomsSelect = ({ selected, setSelected, DATASET }: SymptomsSelectProps) => {

  const [value, setValue] = useState<string>();
  // You can set a few items to be selected initially
  // It's up to you how to filter items based on the input value
  const items = value
    ? DATASET.filter((item:string) => item.toLowerCase().includes(value.toLowerCase()))
    : DATASET;

  const {
    getLabelProps,
    getFocusCaptureProps,
    getInputProps,
    getClearProps,
    getToggleProps,
    getListProps,
    getItemProps,
    isItemSelected,
    removeSelect,
    focused,
    open,
    focusIndex,
    isInputEmpty
  } = useMultiSelect({
    // flipOnSelect: true or false,
    items,
    value,
    onChange: setValue,
    selected,
    onSelectChange: setSelected,
    feature: multiSelect({
      // Options: rovingText, closeOnSelect
      rovingText: true
    })
  });

  return (
    <div>
      <label {...getLabelProps()} {...getFocusCaptureProps()}>
        {""}
      </label>
      <div
        {...getFocusCaptureProps()}
        style={{
          border: '2px solid',
          borderColor: focused ? '#007bff82' : '#aaaaaa2e',
          borderRadius: 4,
          display: 'flex',
          flexWrap: 'wrap',
          maxWidth: 320,
          gap: 6,
          padding: 6
        }}
      >
        {selected.map((item) => (
          <button className="bg-slate-500/25 p-1.5 text-blue-950" key={item} onClick={() => removeSelect(item)}>
            {item}
          </button>
        ))}
        <div>
          <input className="outline-none border border-solid border-slate-500/50 py-1.5 px-2" placeholder="Type symptom..." {...getInputProps()} />
          {!isInputEmpty && <button {...getClearProps()} className='mso !text-sm px-1'>x</button>}
        </div>
        <button {...getToggleProps()}>{open ? '↑' : '↓'}</button>
      </div>

      <ul
        {...getListProps()}
        style={{
          display: open ? 'block' : 'none',
          position: 'absolute',
          listStyle: 'none',
          background: '#fff',
          overflow: 'auto',
          maxHeight: 300,
          margin: 0,
        }}
        className='p-2 text-blue-950'
      >
        {items.length ? (
          items.map((item, index) => (
            <li
              style={{
                background: focusIndex === index ? '#ddd' : 'none'
              }}
              className='text-inherit'
              key={item}
              {...getItemProps({ item, index })}
            >
              {item}
              {isItemSelected(item) && '✔️'}
            </li>
          ))
        ) : (
          <li>No options</li>
        )}
      </ul>
    </div>
  );
};

export default SymptomsSelect;