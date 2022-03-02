import { render } from '@testing-library/react'
import React from 'react'

export interface ImageProp {
    image?: String
}


export function DisplayLogo(props: ImageProp) {
    return(<div>
        <img src="https://photos.smugmug.com/photos/i-DTr3wpH/0/X4/i-DTr3wpH-X4.png"  />
    </div>
    )
}
