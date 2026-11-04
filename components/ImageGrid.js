// components/ImageGrid.js
// Lays out image cards: 1 column on phones, 2 on tablets, 3 on desktops.
import ImageCard from "./ImageCard";

export default function ImageGrid({ images }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <li key={image.id}>
          <ImageCard image={image} index={index} />
        </li>
      ))}
    </ul>
  );
}
