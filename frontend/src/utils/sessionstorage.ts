import { useEffect, useState } from 'react'

function useStickyState(defaultValue: any, key: string) {
	const [value, setValue] = useState(() => {
		const stickyValue = window.sessionStorage.getItem(key)
		if (stickyValue !== null) {
			return JSON.parse(stickyValue)
		}
		return defaultValue
	})
	useEffect(() => {
		window.sessionStorage.setItem(key, JSON.stringify(value))
	}, [key, value])
	return [value, setValue]
}

export default useStickyState
