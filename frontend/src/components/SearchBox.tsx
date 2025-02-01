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
            <title>Search</title>
            <path
              d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit={10}
              strokeWidth={64}
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeMiterlimit={10}
              strokeWidth={32}
              d="M338.29 338.29L448 448"
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
