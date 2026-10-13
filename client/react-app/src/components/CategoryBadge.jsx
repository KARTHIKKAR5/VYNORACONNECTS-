function CategoryBadge({ category = "Resource" }) {
    return (
        <span className="category-badge">
            {category}
        </span>
    );
}

export default CategoryBadge;