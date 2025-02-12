package models

// import (
// 	"go.mongodb.org/mongo-driver/bson/primitive"
// )

// // VendorProfile represents a vendor's profile.
// type VendorProfile struct {
// 	BaseProfile    `bson:",inline"`
// 	BusinessName   string          `bson:"business_name" json:"businessName" validate:"required"`
// 	StoreName      *string         `bson:"store_name,omitempty" json:"storeName"`
// 	SellerRating   *float64        `bson:"seller_rating,omitempty" json:"sellerRating"`
// 	Services       []string        `bson:"services" json:"services"`
// 	PaymentMethods []string        `bson:"payment_methods" json:"paymentMethods"`
// 	Inventory      []InventoryItem `bson:"inventory" json:"inventory"`
// }
// type InventoryItem struct {
// 	Category string   `bson:"category" json:"category" validate:"required"`
// 	Items    []string `bson:"items" json:"items" validate:"required"`
// }

// // NewVendorProfile creates a new VendorProfile.
// func NewVendorProfile(userID primitive.ObjectID, role string) *VendorProfile {
// 	return &VendorProfile{
// 		BaseProfile: BaseProfile{
// 			UserID:     userID,
// 			Role:       role,
// 			Skills:     []string{},
// 			Experience: []Experience{},
// 			Portfolio:  []string{},
// 		},
// 		BusinessName:   "",
// 		Services:       []string{},
// 		PaymentMethods: []string{},
// 		Inventory:      []InventoryItem{},
// 	}
// }
