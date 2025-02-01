import styled from "styled-components";

const SearchBox  = () => {
  return (
    <StyledWrapper>
      <div className="container">
        <input
          type="text"
          name="text"
          className="input"
          required
          placeholder="Type to search..."
        />
        <div className="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ionicon"
            viewBox="0 0 512 512"
          >
            <title>Send</title>
            <path
              d="M476.59 227.05L94.17 35.47a12.82 12.82 0 00-17.8 15.07L105.4 243.14a12 12 0 000 6.27L76.37 461.46a12.83 12.83 0 0017.8 15.07l382.42-191.58a12.82 12.82 0 000-23.9zM252 295.91L136.72 430l-7.78-74.05z"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={32}
            />
          </svg>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    position: relative;
    --size-button: 40px;
    color: white;
  }

  .input {
    padding-left: var(--size-button);
    height: var(--size-button);
    font-size: 15px;
    border: none;
    color: black;
    outline: none;
    width: var(--size-button);
    transition: all ease 0.3s;
    background-color: transparent; /* No black background */
    border-radius: 50px;
    cursor: pointer;
  }

  .input:focus,
  .input:not(:invalid) {
    width: 200px;
    cursor: text;
    background-color: white; /* White background after clicking */
    color: black;
    border-radius: 50px;
    padding-left: 45px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  }

  .container .icon {
    position: absolute;
    width: var(--size-button);
    height: var(--size-button);
    top: 0;
    left: 0;
    padding: 8px;
    pointer-events: none;
    color: white; /* Default white icon */
    transition: color 0.3s ease;
  }

  .input:focus ~ .icon,
  .input:not(:invalid) ~ .icon {
    color: black; /* Turns black when focused */
  }

  .container .icon svg {
    width: 100%;
    height: 100%;
  }
`;

export default SearchBox;
