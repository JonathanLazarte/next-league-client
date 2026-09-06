import CustomSelect from "@/components/CustomSelect/CustomSelect";
import { FaSearch } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { FILTER_OPTIONS_BY_GROUPING } from "@/utils/constants";

export default function Filters({
  setSearchKeys,
  showNotObtained,
  setShowNotObtained,
  groupedBy,
  setGroupedBy,
  sortedBy,
  setSortedBy }) {

  return <div>
  <div className="search-filter">
    <FaSearch className="search-icon" />
    <input
      placeholder="Search"
      type="search"
      onChange={(event) => setSearchKeys(event.currentTarget.value)}
      aria-label="Buscar skins"
    />
  </div>
  <div className="checkbox-container">
    {groupedBy !== "collection" ? (
      <div
        className="checkbox"
        onClick={() => setShowNotObtained((prevState) => !prevState)}
        role="checkbox"
        aria-checked={showNotObtained}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowNotObtained((prevState) => !prevState);
          }
        }}
      >
        <div className="custom-checkbox" aria-hidden="true">
          {showNotObtained ? <FaCheck className="check-icon" /> : null}
        </div>
        Show Unowned
      </div>
    ) : (
      <div className="h-3" aria-hidden="true"></div>
    )}
  </div>
  <CustomSelect
    className="select-filter"
    options={[
      { value: "collection", label: "My collection" },
      { value: "all", label: "All" },
      { value: "champion", label: "Champion" },
      { value: "set", label: "Set" },
      { value: "level", label: "Tier" },
    ]}
    value={groupedBy}
    onChange={setGroupedBy}
    placeholder="Seleccionar agrupación..."
  />
  <CustomSelect
    className="select-filter"
    options={FILTER_OPTIONS_BY_GROUPING[groupedBy] || []}
    value={sortedBy}
    onChange={setSortedBy}
    placeholder="Seleccionar orden..."
    />

</div>
}
