import { styled } from "../tools/stitches";

const Button = styled('button', {
    display: "block",
    backgroundColor: 'gainsboro',
    border: "none",
    outline: "none",
    borderRadius: '9999px',
    fontSize: 13,
    padding: '10px 15px',
    '&:hover': {
        backgroundColor: 'lightgray',
    },
})

export default Button;