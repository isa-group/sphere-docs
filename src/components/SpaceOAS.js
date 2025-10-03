import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"

export default function SpaceOAS() {
  const { siteConfig } = useDocusaurusContext()
  return <SwaggerUI url={siteConfig.customFields.spaceOasUrl} supportedSubmitMethods={[]} />
}

