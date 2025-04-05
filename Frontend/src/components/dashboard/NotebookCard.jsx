import React, { useState } from 'react';
import { format } from 'date-fns';
import { assets } from '../../assets/assets';

const NotebookCard = ({ notebook }) => {
  const [imageError, setImageError] = useState(false);
  const createdDate = notebook.createdAt ? 
    format(new Date(notebook.createdAt), 'MMM d, yyyy') : 
    'Recent';

  return (
    <div className="group relative h-[80%] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imageError ? assets.background : notebook.coverImage}
          alt={notebook.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 p-4 text-white">
        <h3 className="text-lg font-semibold">{notebook.name}</h3>
        <p className="text-sm opacity-80">
          Created {createdDate}
        </p>
      </div>
    </div>
  );
};

export default NotebookCard;