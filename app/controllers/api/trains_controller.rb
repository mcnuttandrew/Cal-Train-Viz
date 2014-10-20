class Api::TrainsController < ApplicationController
  def index
    trains = Train.all
    render json: trains
  end
  
  def show
    @train  = Train.find_by_id(params[:id])
    render :show
  end
end
