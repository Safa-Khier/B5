import React from 'react'

export const Cell = prop =>{
    return (prop.header ? <th>{prop.data}</th> : <td>{prop.data}</td>)
}

export default Cell