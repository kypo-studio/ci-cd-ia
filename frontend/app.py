import streamlit as st
import requests
import os
from datetime import datetime

# Configuration
st.set_page_config(
    page_title="CI/CD Dashboard",
    page_icon="🚀",
    layout="wide"
)

BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:5000')

# Header
st.title("🚀 CI/CD Pipeline Dashboard")
st.markdown("---")

# Sidebar
with st.sidebar:
    st.header("⚙️ Configuration")
    st.info(f"**Backend URL:** {BACKEND_URL}")
    st.markdown("---")
    st.caption(f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

# Main content
col1, col2 = st.columns(2)

with col1:
    st.subheader("📊 Backend Status")
    
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if response.status_code == 200:
            st.success("✅ Backend is healthy")
            st.json(response.json())
        else:
            st.error(f"❌ Backend error: {response.status_code}")
    except Exception as e:
        st.error(f"❌ Cannot connect to backend: {str(e)}")

with col2:
    st.subheader("📡 API Data")
    
    if st.button("🔄 Fetch Data"):
        try:
            response = requests.get(f"{BACKEND_URL}/api/data", timeout=5)
            if response.status_code == 200:
                data = response.json()
                st.success("✅ Data fetched successfully")
                st.json(data)
            else:
                st.error(f"❌ Error: {response.status_code}")
        except Exception as e:
            st.error(f"❌ Error: {str(e)}")

# Footer
st.markdown("---")
st.caption("🚀 CI/CD Pipeline - Backend + Frontend | Built with Streamlit")
