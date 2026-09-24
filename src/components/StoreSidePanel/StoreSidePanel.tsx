import { FaSearch } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import type { Dispatch, SetStateAction } from "react";
import type { SortOptions, SortOptionsValues, FilterCategories } from "@/types/ui";


interface StoreSidePanelProps {
  subsections: string[];
  subsectionSelected: string;
  setSubsectionSelected: Dispatch<SetStateAction<string>>;
  searchKeys: string;
  setSearchKeys: Dispatch<SetStateAction<string>>;
  inCollection: boolean;
  setInCollection: Dispatch<SetStateAction<boolean>>;
  sortOptions: SortOptions;
  sortedBy: SortOptionsValues | null;
  setSortedBy: Dispatch<SetStateAction<SortOptionsValues | null>>;
  itemCategoryChecked: Record<string, any>;
  setItemCategoryChecked: Dispatch<SetStateAction<Record<string, any>>>;
  championInCollection?: boolean;
  setChampionInCollection?: Dispatch<SetStateAction<boolean>>;
}

export default function StoreSidePanel({
  subsections,
  subsectionSelected,
  setSubsectionSelected,
  searchKeys,
  setSearchKeys,
  inCollection,
  setInCollection,
  sortOptions,
  sortedBy,
  setSortedBy,
  itemCategoryChecked,
  setItemCategoryChecked,
  championInCollection,
  setChampionInCollection
}: StoreSidePanelProps) {

  const handleCheckboxChange = (role: keyof FilterCategories) => {
    setItemCategoryChecked((prev) => ({
      ...prev,
      [role as keyof typeof prev]: !prev[role as keyof typeof prev],
    }));
  };

  return <div className="filter-nav">
    <section className="nav-section first">
      {subsections.map((subsection) => (
        <div
          key={subsection}
          onClick={() => setSubsectionSelected(subsection)}
          className="checkbox section"
        >
          <div className="custom-checkbox-romb">
            {subsectionSelected === subsection && (
              <div className="check-element" />
            )}
          </div>
          <div
            className={
              subsectionSelected === subsection ? "section-selected" : ""
            }
          >
            {subsection}
          </div>
        </div>
      ))}
    </section>

    <section className="nav-section">
      <div className="search-filter">
        <FaSearch className="search-icon" />
        <input
          placeholder="Search"
          type="search"
          value={searchKeys}
          onChange={(e) => setSearchKeys(e.target.value)}
        />
      </div>
      <div
        onClick={() => setInCollection((prev) => !prev)}
        className="checkbox incollection"
      >
        <div className="custom-checkbox">
          {inCollection && <FaCheck className="check-icon" />}
        </div>
        Show Owned
      </div>
    </section>

    <section className="nav-section">
      <CustomSelect
        className="select-filter"
        options={sortOptions}
        value={sortedBy}
        onChange={setSortedBy}
        placeholder="Select..."
      />
      {championInCollection !== undefined && setChampionInCollection !== undefined && (
        <div
          onClick={() => setChampionInCollection((prev) => !prev)}
          className="checkbox"
        >
          <div className="custom-checkbox">
            {championInCollection && <FaCheck className="check-icon" />}
          </div>
          Champion Owned
        </div>
      )}

      {(Object.keys(itemCategoryChecked) as Array<keyof FilterCategories>).map((cat) => (
        <div
          key={cat}
          className="checkbox"
          onClick={() => handleCheckboxChange(cat)}
        >
          <div className="custom-checkbox">
            {itemCategoryChecked[cat] && <FaCheck className="check-icon" />}
          </div>
          {cat}
        </div>
      ))}
    </section>

    <section className="nav-section last">
      <div className="checkbox">
        <div className="custom-checkbox" />
        On Sale
      </div>
    </section>
  </div>
}
