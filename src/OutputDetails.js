const OutputDetails = ({ outputDetails }) => {
  return (
    <div>
      <p>
        Status:{" "}
        <span>
          {outputDetails?.status?.description}
        </span>
      </p>
      <p>
        Memory:{" "}
        <span>
          {outputDetails?.memory}
        </span>
      </p>
      <p>
        Time:{" "}
        <span>
          {outputDetails?.time}
        </span>
      </p>
    </div>
  );
};

export default OutputDetails;
