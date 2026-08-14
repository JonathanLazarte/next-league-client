import { FaSearch } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import CustomSelect from "@/components/CustomSelect/CustomSelect.jsx";

export default function StoreSidePanel({ subsections, subsectionSelected, setSubsectionSelected, searchKeys, setSearchKeys, inCollection, setInCollection, sortedBy, setSortedBy, itemCategories, itemCategoryChecked, setItemCategoryChecked }) {

  const handleCheckboxChange = (role) => {
    setItemCategoryChecked((prev) => ({
      ...prev,
      [role]: !prev[role],
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
        options={[
          { value: "", label: "Lanzamiento (descendente)" },
          { value: "ReleaseAscend", label: "Lanzamiento (ascendente)" },
          { value: "PriceRpDescend", label: "Precio (RP) (descendente)" },
          { value: "PriceRpAscend", label: "Precio (RP) (ascendente)" },
          { value: "PriceBeDescend", label: "Precio (EA) (descendente)" },
          { value: "PriceBeAscend", label: "Precio (EA) (ascendente)" },
          { value: "AlphabeticallyDescend", label: "Alfabético (A-Z)" },
          { value: "AlphabeticallyAscend", label: "Alfabético (Z-A)" },
        ]}
        value={sortedBy}
        onChange={setSortedBy}
      />

      {itemCategories.map((cat) => (
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
