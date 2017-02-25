import React from 'react';
import CategoryItem from './CategoryItem';


const Category = ({category, onConfigure}) => {

    const categoryList = category.map(
        (item) => {
            return (
                <CategoryItem
                    key={item.get('id')}
                    id={item.get('id')}
                    name={item.get('name')}
                    depth={item.get('depth')}
                />
            )
        }
    )
    return (
        <div className="category">
            <div className="edit" onClick={onConfigure}>[수정]</div>
            {categoryList}
        </div>
    );
};

export default Category;