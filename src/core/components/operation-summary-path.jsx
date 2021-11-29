import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Iterable } from "immutable"
import { createDeepLinkPath } from "core/utils"
import ImPropTypes from "react-immutable-proptypes"

export default class OperationSummaryPath extends PureComponent{

  static propTypes = {
    specPath: ImPropTypes.list.isRequired,
    operationProps: PropTypes.instanceOf(Iterable).isRequired,
    getComponent: PropTypes.func.isRequired,
  }

  render(){
    let {
      getComponent,
      operationProps,
    } = this.props


    let {
      deprecated,
      isShown,
      path,
      tag,
      operationId,
      isDeepLinkingEnabled,
      method,
    } = operationProps.toJS()

    /**
     * Add <wbr> word-break elements between each segment, before the slash
     * to allow browsers an opportunity to break long paths into sensible segments.
     */
    const pathParts = path.split(/(?=\/)/g)
    for (let i = 1; i < pathParts.length; i += 2) {
      pathParts.splice(i, 0, <wbr key={i} />)
    }

    const DeepLink = getComponent( "DeepLink" )
    // TODO - proto
    const isReply = method === 'request' || method === 'message'
    if (isReply) {
      pathParts[0] = pathParts[0].slice(1)
    }
    return(
      <span className={ deprecated ? "opblock-summary-path__deprecated" : "opblock-summary-path" }
        data-path={path}>
        <DeepLink
            enabled={isDeepLinkingEnabled}
            isShown={isShown}
            path={createDeepLinkPath(`${tag}/${operationId}`)}
            text={pathParts} />
      </span>

    )
  }
}
