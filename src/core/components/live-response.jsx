import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { Iterable } from "immutable"

const Headers = ( { headers } )=>{
  return (
    <div>
      <h5>Response headers</h5>
      <pre className="microlight">{headers}</pre>
    </div>)
}
Headers.propTypes = {
  headers: PropTypes.array.isRequired
}

const Duration = ( { duration } ) => {
  return (
    <div>
      <h5>Request duration</h5>
      <pre className="microlight">{duration} ms</pre>
    </div>
  )
}
Duration.propTypes = {
  duration: PropTypes.number.isRequired
}


export default class LiveResponse extends React.Component {
  static propTypes = {
    response: PropTypes.instanceOf(Iterable).isRequired,
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    displayRequestDuration: PropTypes.bool.isRequired,
    specSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    // BUG: props.response is always coming back as a new Immutable instance
    // same issue as responses.jsx (tryItOutResponse)
    return this.props.response !== nextProps.response
      || this.props.path !== nextProps.path
      || this.props.method !== nextProps.method
      || this.props.displayRequestDuration !== nextProps.displayRequestDuration
  }

  render() {
    const { response, getComponent, getConfigs, displayRequestDuration, specSelectors, path, method } = this.props
    const { showMutatedRequest } = getConfigs()

    const curlRequest = showMutatedRequest ? specSelectors.mutatedRequestFor(path, method) : specSelectors.requestFor(path, method)
    const url = curlRequest.get("url")
    const headers = response.get("headers").toJS()
    const isError = response.get("error")
    const body = response.get("text")
    const duration = response.get("duration")
    const contentType = headers["content-type"] || headers["Content-Type"]

    const ResponseBody = getComponent("responseBody")
    const Markdown = getComponent("Markdown", true)

    return (
      <div>
        <h4>Server response</h4>
        <table className="responses-table live-responses-table">
          <thead>
          <tr className="responses-header">
            <td className="col_header response-col_description">Details</td>
          </tr>
          </thead>
          <tbody>
            <tr className="response">
              <td className="response-col_description">
                {
                  isError ? <Markdown source={`${response.get("name") !== "" ? `${response.get("name")}: ` : ""}${response.get("message")}`}/>
                          : null
                }
                {
                  body ? <ResponseBody content={ body }
                                       contentType={ contentType }
                                       url={ url }
                                       headers={ headers }
                                       getConfigs={ getConfigs }
                                       getComponent={ getComponent }/>
                       : null
                }
                {
                  displayRequestDuration && duration ? <Duration duration={ duration } /> : null
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    response: ImPropTypes.map
  }
}
