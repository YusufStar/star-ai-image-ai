"use client"

import { User } from "@heroui/react"

const AuthenticationSidebar = () => {
    return (
        <div
        className="relative hidden w-1/2 flex-col-reverse rounded-medium p-10 shadow-small lg:flex"
        style={{
          backgroundImage:
            "url(https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/white-building.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col items-end gap-4">
          <User
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
            }}
            classNames={{
              base: "flex flex-row-reverse",
              name: "w-full text-right text-black",
              description: "text-black/80",
            }}
            description="Founder & CEO at ACME"
            name="Bruno Reichert"
          />
          <p className="w-full text-right text-2xl text-black/60">
            <span className="font-medium">&ldquo;</span>
            <span className="font-normal italic">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa
              volutpat aliquet.
            </span>
            <span className="font-medium">&rdquo;</span>
          </p>
        </div>
      </div>
    )
}

export default AuthenticationSidebar