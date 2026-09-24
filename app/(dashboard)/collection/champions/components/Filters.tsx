import { FaSearch } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import { ChampionGroupingOptionsValues, SortOptionsValues } from "@/types/ui";
import { CHAMPION_SORT_OPTIONS, CHAMPION_GROUP_OPTIONS } from "@/utils/constants";

interface FiltersProps {
  setSearchKeys: React.Dispatch<React.SetStateAction<string>>;
  inCollection: boolean,
  setInCollection: React.Dispatch<React.SetStateAction<boolean>>;
  groupedBy: ChampionGroupingOptionsValues | null;
  setGroupedBy: React.Dispatch<React.SetStateAction<ChampionGroupingOptionsValues | null>>;
  sortedBy: SortOptionsValues | null;
  setSortedBy: React.Dispatch<React.SetStateAction<SortOptionsValues | null>>;
}

export default function Filters({
    setSearchKeys,
    inCollection,
    setInCollection,
    groupedBy,
    setGroupedBy,
    sortedBy,
    setSortedBy,
}: FiltersProps) {
    return (
        <div className="filter-nav">
            <div className="left-place">
                <div className="square-hextech">
                  <svg
                    className="hextech-border"
                    id="Capa_2"
                    data-name="Capa 2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 243.62 224.22"
                  >
                    <g id="Containers">
                      <g>
                        <path
                          className="cls-1"
                          d="M1,7.93c4.73,0,8.56-3.1,8.56-6.93h224.49c0,3.83,3.83,6.93,8.56,6.93"
                        />
                        <path
                          className="cls-1"
                          d="M16.5,218.88c-2.22-5.21-8.31-8.95-15.5-8.95V14.57c7.19,0,13.28-3.74,15.5-8.95"
                        />
                        <path
                          className="cls-1 resalted"
                          d="M242.62,216.29c-4.73,0-8.56,3.1-8.56,6.93H9.56c0-3.83-3.83-6.93-8.56-6.93"
                        />
                        <path
                          className="cls-1"
                          d="M227.12,5.33c2.22,5.21,8.31,8.95,15.5,8.95v195.36c-7.19,0-13.28,3.74-15.5,8.95"
                        />
                      </g>
                    </g>
                  </svg>
                    <div className="maestry-etern-levels">
                        <div className="amount-and-description">
                            <div className="amount">0</div>
                            <div className="description">TOTAL MASTERY LEVEL</div>
                        </div>
                        <div className="amount-and-description">
                            <div className="amount">0</div>
                            <div className="description">ETERNALS MILESTONES</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="right-place">
                <div className="search-filter">
                    <FaSearch className="search-icon" />
                    <input
                        placeholder="Search"
                        type="search"
                        onKeyUp={(event) => setSearchKeys(event.currentTarget.value)}
                    ></input>
                </div>

                {groupedBy !== "possession" ? (
                    <div
                        className="checkbox"
                        onClick={() => setInCollection((prevState) => !prevState)}
                    >
                        <div className="custom-checkbox">
                            {!inCollection ? <FaCheck className="check-icon" /> : null}
                        </div>
                        Show Unowned
                    </div>
                ) : (
                    <div style={{ height: "5.4rem" }} className="h-3"></div>
                )}

                <CustomSelect
                    className="select-filter"
                    options={CHAMPION_GROUP_OPTIONS}
                    value={groupedBy}
                    onChange={setGroupedBy}
                    placeholder="Select Grouping..."
                />

                <CustomSelect
                    className="select-filter"
                    options={CHAMPION_SORT_OPTIONS}
                    value={sortedBy}
                    onChange={setSortedBy}
                    placeholder="Select Sorting..."
                />
            </div>
        </div>
    )
}
