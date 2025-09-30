export function VersionTable({ name, libraries }) {
  return (
    <table>
      <tr>
        <td></td>
        <td>Pricing4Java</td>
        <td>Pricing4TS</td>
      </tr>
      <tr>
        <td>
          <code>{name}</code>
        </td>
        {libraries.map((library) => (
          <td title={typeof library === "string" ? library : ""}>
            {getSupport(library)}
          </td>
        ))}
      </tr>
    </table>
  );
}

function getSupport(supportType) {
  if (typeof supportType === "boolean") {
    return supportType ? <>&#10003;</> : <>&#10007;</>;
  } else {
    return "~";
  }
}
