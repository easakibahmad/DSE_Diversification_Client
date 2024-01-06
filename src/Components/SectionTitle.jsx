const SectionTitle = ({ heading }) => {
  return (
    <div>
      <h4 className="text-center lg:text-2xl sm:text-md font-bold text-white uppercase pb-4">
        {heading}
      </h4>
    </div>
  );
};

export default SectionTitle;
