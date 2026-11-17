export function initKatalogFilter() {
  const filterButtons = document.querySelectorAll(
    "#katalogFilterBar .filter-btn",
  );
  const catalogItems = document.querySelectorAll(
    "#productGridContainer .catalog-item",
  );

  if (!filterButtons.length || !catalogItems.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterButtons.forEach((b) => {
        b.classList.remove("active", "bg-slate-950", "text-white");
        b.classList.add(
          "bg-white",
          "text-stone-700",
          "border",
          "border-stone-200/90",
        );
      });

      btn.classList.add("active", "bg-slate-950", "text-white");
      btn.classList.remove(
        "bg-white",
        "text-stone-700",
        "border",
        "border-stone-200/90",
      );

      catalogItems.forEach((item) => {
        const itemCategory = item.getAttribute("data-category");
        if (filter === "all" || itemCategory === filter) {
          item.style.display = "flex";
          item.style.opacity = "0";
          item.style.transform = "translateY(8px)";
          setTimeout(() => {
            item.style.transition = "all 0.3s ease";
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          }, 30);
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}
