import {
    ApolloClient,
    InMemoryCache,
    DocumentNode,
    QueryHookOptions,
    useQuery,
    DefaultOptions,
} from '@apollo/client'
import Stack from '@mui/joy/Stack'
import { createUploadLink } from 'apollo-upload-client'
import { createContext, createElement, FC, useContext, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { capitalize } from 'lodash'

import { M4State } from 'app/store'
import { GRAPHQL_URL } from 'app/config'
import { useErrorSnack } from 'app/hooks/useErrorSnack'
import { LoadingCrumb } from 'app/components/LoadingCrumb'

export const client = new ApolloClient({
    uri: GRAPHQL_URL,
    cache: new InMemoryCache(),
    link: createUploadLink({
        uri: GRAPHQL_URL,
    }),
    // defaultOptions: defaultOptions,
})

// NOTE: Only for django.NodeObjectType - django.ObjectType is flat arrays
export const relayConnectionNodes = (connection) => connection.edges.map((edge) => edge.node)

export type createProviderParams<V = any, Q = any> = {
    name?: string
    field?: string
    query: DocumentNode
    options?: QueryHookOptions
    selectResults?: (data: Q) => V | null
    setSkipping?: (state: any) => { skipping?: boolean } | null
    selectVariables?: (state: M4State) => any
}

export const createProvider = <V = any, Q = any>({
    name,
    field,
    query,
    options,
    selectVariables = () => ({}),
    setSkipping = () => ({}),
    selectResults = (data) => data[field!],
}: createProviderParams<V, Q>) => {
    const context = createContext<V | null>(null)
    const useValue = () => useContext(context)
    const Provider: FC<any> = ({ children, ...rest }) => {
        const variables = useSelector(selectVariables)
        const skipping = useSelector(setSkipping)
        const { data, loading, error } = useQuery<Q>(query, {
            ...options,
            variables: {
                ...options?.variables,
                ...variables,
                ...rest,
            },
            skip: skipping?.skipping,
        })

        const value = useMemo(() => {
            if (!data) {
                return null
            }

            return selectResults(data)
        }, [data])

        useErrorSnack(error)
        if (loading) {
            console.log('loading ---', query.definitions[0]['name'].value)
            return (
                <Stack alignItems='center' justifyContent='center'>
                    <LoadingCrumb what={query.definitions[0]['name'].value} />
                </Stack>
            )
        }

        return createElement(context.Provider, { value }, children)
    }

    // TODO: This name won't necessarily match the component name given when exported
    Provider.displayName = name || field ? `${capitalize(field)}Provider` : undefined

    return {
        ...context,
        Provider,
        useValue,
    }
}
