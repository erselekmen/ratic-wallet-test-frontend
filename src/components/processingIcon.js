import LoopIcon from "@mui/icons-material/Loop";

export default function ProcessingIcon({ color, sx }) {
  return (
    <LoopIcon
      color={color}
      sx={{
        ...sx,
        animation: "spin 2s linear infinite",
        "@keyframes spin": {
          "0%": {
            transform: "rotate(360deg)",
          },
          "100%": {
            transform: "rotate(0deg)",
          },
        },
      }}
    />
  );
}
