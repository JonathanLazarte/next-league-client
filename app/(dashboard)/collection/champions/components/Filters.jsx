import { FaSearch } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import CustomSelect from "@/components/CustomSelect/CustomSelect.jsx";

export default function Filters({
    setSearchKeys,
    inCollection,
    setInCollection,
    groupedBy,
    setGroupedBy,
    sortedBy,
    setSortedBy,
}) {
    return (
        <div className="filter-nav">
            <div className="left-place">
                <div className="square-hextech">
                    <img className="square-hextech-frame top" src="/collection/square-hextech-frame-top.png"></img>
                    <img className="square-hextech-frame bot" src="/collection/square-hextech-frame-bot.png"></img>
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

                {groupedBy != "possession" ? (
                    <div
                        className="checkbox"
                        onClick={() => setInCollection((prevState) => !prevState)}
                    >
                        <div className="custom-checkbox" type="checkbox">
                            {!inCollection ? <FaCheck className="check-icon" /> : null}
                        </div>
                        Show Unowned
                    </div>
                ) : (
                    <div style={{ height: "5.4rem" }} className="h-3"></div>
                )}

                <CustomSelect
                    className="select-filter"
                    options={[
                        { value: "", label: "All Champions" },
                        { value: "possession", label: "Most Popular Posesition" },
                        { value: "role", label: "Role" },
                    ]}
                    value={groupedBy}
                    onChange={setGroupedBy}
                    placeholder="Select Grouping..."
                />

                <CustomSelect
                    className="select-filter"
                    options={[
                        { value: "alphabetically", label: "Alphabetical" },
                        { value: "championsMastery", label: "Champion Mastery" },
                    ]}
                    value={sortedBy}
                    onChange={setSortedBy}
                    placeholder="Select Sorting..."
                />
            </div>
        </div>
    )
}