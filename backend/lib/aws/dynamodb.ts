import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: process.env.REGION || "us-east-1" })
const docClient = DynamoDBDocumentClient.from(client)

/**
 * Put an item into DynamoDB table
 * @param tableName - Name of the DynamoDB table
 * @param item - Item to insert
 * @returns Success status and data
 */
export const putItem = async (tableName: string, item: any) => {
    try {
        const command = new PutCommand({
            TableName: tableName,
            Item: item,
        })
        
        await docClient.send(command)
        return { success: true, data: item }
    } catch (error) {
        console.error("Error putting item:", error)
        return { success: false, error }
    }
}

/**
 * Get an item from DynamoDB table by primary key
 * @param tableName - Name of the DynamoDB table
 * @param key - Primary key object (partition key and sort key if applicable)
 * @returns Item data or null if not found
 */
export const getItem = async (tableName: string, key: any) => {
    try {
        const command = new GetCommand({
            TableName: tableName,
            Key: key,
        })
        
        const response = await docClient.send(command)
        return { success: true, data: response.Item || null }
    } catch (error) {
        console.error("Error getting item:", error)
        return { success: false, error }
    }
}

/**
 * Query items from DynamoDB table
 * @param tableName - Name of the DynamoDB table
 * @param keyConditionExpression - Key condition expression
 * @param expressionAttributeValues - Expression attribute values
 * @param indexName - Optional GSI name
 * @returns Array of items
 */
export const queryItems = async (
    tableName: string,
    keyConditionExpression: string,
    expressionAttributeValues: any,
    indexName?: string
) => {
    try {
        const command = new QueryCommand({
            TableName: tableName,
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            IndexName: indexName,
        })
        
        const response = await docClient.send(command)
        return { success: true, data: response.Items || [] }
    } catch (error) {
        console.error("Error querying items:", error)
        return { success: false, error }
    }
}

/**
 * Update an item in DynamoDB table
 * @param tableName - Name of the DynamoDB table
 * @param key - Primary key object
 * @param updateExpression - Update expression
 * @param expressionAttributeValues - Expression attribute values
 * @returns Updated item
 */
export const updateItem = async (
    tableName: string,
    key: any,
    updateExpression: string,
    expressionAttributeValues: any
) => {
    try {
        const command = new UpdateCommand({
            TableName: tableName,
            Key: key,
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW",
        })
        
        const response = await docClient.send(command)
        return { success: true, data: response.Attributes }
    } catch (error) {
        console.error("Error updating item:", error)
        return { success: false, error }
    }
}
