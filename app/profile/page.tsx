"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  ShoppingBag,
  Utensils,
  ArrowLeft,
  Camera,
  Loader2,
} from "lucide-react"
import { userApi, type User } from "@/lib/api"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState<User | null>(null)
  const [editData, setEditData] = useState({
    name: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const user = JSON.parse(storedUser)
          setUserData(user)
          setEditData({ name: user.name, email: user.email })
          setIsLoading(false)
          return
        }

        const response = await userApi.getProfile()
        if (response.success && response.data) {
          setUserData(response.data)
          setEditData({ name: response.data.name, email: response.data.email })
        } else {
          router.push("/login")
        }
      } catch (err) {
        console.error("[v0] Profile load error:", err)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleSave = async () => {
    setIsSaving(true)
    setError("")

    try {
      const response = await userApi.updateProfile(editData)
      if (response.success && response.data) {
        setUserData(response.data)
        localStorage.setItem("user", JSON.stringify(response.data))
        setIsEditing(false)
        console.log("[v0] Profile updated successfully")
        toast({
          title: "Profile Updated",
          description: "Your profile information has been successfully updated.",
        })
      } else {
        setError(response.error || "Failed to update profile")
        toast({
          title: "Update Failed",
          description: response.error || "Unable to update your profile. Please try again.",
          variant: "destructive",
        })
      }
    } catch (err) {
      setError("Network error. Please try again.")
      console.error("[v0] Profile update error:", err)
      toast({
        title: "Network Error",
        description: "Unable to connect to the server. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (userData) {
      setEditData({ name: userData.name, email: userData.email })
    }
    setIsEditing(false)
    setError("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                <Utensils className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">FoodFast Delivery</h1>
                <p className="text-sm text-muted-foreground">Profile Settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Profile Header Card */}
        <Card className="border-border shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-border">
                  <AvatarImage src={userData.avatar || "/professional-headshot.png"} alt="Profile" />
                  <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{userData.name}</h2>
                    <p className="text-muted-foreground">{userData.email}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        <Star className="w-3 h-3 mr-1" />
                        Premium Member
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined March 2024
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "outline" : "default"}
                    className="shrink-0"
                    disabled={isSaving}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Manage your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="bg-input border-border"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email Address</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="bg-input border-border"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSave} size="sm" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm" disabled={isSaving}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{userData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">123 Main Street, New York, NY 10001</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Account Statistics
              </CardTitle>
              <CardDescription>Your activity and preferences overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-2xl font-bold text-primary">47</div>
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-2xl font-bold text-primary">4.8</div>
                  <div className="text-sm text-muted-foreground">Avg Rating</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Favorite Cuisine</span>
                  <Badge variant="secondary">Italian</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Delivery Preference</span>
                  <Badge variant="secondary">Express</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Loyalty Points</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    2,340 pts
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your account settings and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <ShoppingBag className="w-5 h-5" />
                <span className="text-sm">Order History</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">Addresses</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <Star className="w-5 h-5" />
                <span className="text-sm">Favorites</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <Mail className="w-5 h-5" />
                <span className="text-sm">Support</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
