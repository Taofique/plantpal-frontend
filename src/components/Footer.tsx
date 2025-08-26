export default function Footer() {
  return (
    <footer className="bg-green-700 text-white mt-10 py-4">
      <div className="max-w-7xl mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} PlantPal. All rights reserved.
      </div>
    </footer>
  );
}
